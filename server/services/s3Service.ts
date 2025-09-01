import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
  private client!: S3Client;
  private bucketName!: string;
  private isConfigured: boolean = false;

  constructor() {
    try {
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET_NAME) {
        this.client = new S3Client({
          region: process.env.AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
        this.isConfigured = true;
      } else {
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('Failed to initialize S3 service:', error);
      this.isConfigured = false;
    }
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string = 'application/octet-stream'): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('S3 service not configured. Please provide AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME environment variables.');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(command);
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  async uploadUserDocument(userId: string, fileName: string, buffer: Buffer, documentType: 'receipt' | 'statement' | 'profile' | 'other' = 'other'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `users/${userId}/${documentType}/${timestamp}-${fileName}`;
    
    // Detect content type based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
    }

    return this.uploadFile(key, buffer, contentType);
  }

  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('S3 service not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('S3 service not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  async listUserFiles(userId: string, documentType?: string): Promise<string[]> {
    if (!this.isConfigured) {
      throw new Error('S3 service not configured');
    }

    const prefix = documentType ? `users/${userId}/${documentType}/` : `users/${userId}/`;
    
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
    });

    const response = await this.client.send(command);
    return response.Contents?.map(obj => obj.Key || '') || [];
  }

  // Backup entire user data to S3
  async backupUserData(userId: string, userData: any): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('S3 service not configured');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `backups/${userId}/${timestamp}-user-data.json`;
    const buffer = Buffer.from(JSON.stringify(userData, null, 2));

    return this.uploadFile(key, buffer, 'application/json');
  }
}

export const s3Service = new S3Service();