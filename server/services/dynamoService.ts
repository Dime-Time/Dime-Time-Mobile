import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand, 
  ScanCommand 
} from "@aws-sdk/lib-dynamodb";

export class DynamoService {
  private client!: DynamoDBDocumentClient;
  private isConfigured: boolean = false;

  constructor() {
    try {
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        const dynamoClient = new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
        
        this.client = DynamoDBDocumentClient.from(dynamoClient);
        this.isConfigured = true;
      } else {
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('Failed to initialize DynamoDB service:', error);
      this.isConfigured = false;
    }
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  // Generic CRUD operations for any table
  async putItem(tableName: string, item: any): Promise<any> {
    if (!this.isConfigured) {
      throw new Error('DynamoDB service not configured. Please provide AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    }

    // Convert Date objects to ISO strings for DynamoDB compatibility
    const serializedItem = this.serializeDates(item);

    const command = new PutCommand({
      TableName: tableName,
      Item: serializedItem,
    });

    await this.client.send(command);
    return item;
  }

  // Helper method to convert Date objects to ISO strings
  private serializeDates(obj: any): any {
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.serializeDates(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
      const serialized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        serialized[key] = this.serializeDates(value);
      }
      return serialized;
    }
    
    return obj;
  }

  async getItem(tableName: string, key: any): Promise<any> {
    if (!this.isConfigured) {
      throw new Error('DynamoDB service not configured');
    }

    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });

    const response = await this.client.send(command);
    return response.Item;
  }

  async updateItem(tableName: string, key: any, updates: any): Promise<any> {
    if (!this.isConfigured) {
      throw new Error('DynamoDB service not configured');
    }

    const updateExpression = Object.keys(updates)
      .map((attr, index) => `#attr${index} = :val${index}`)
      .join(', ');

    const expressionAttributeNames = Object.keys(updates).reduce((acc: Record<string, string>, attr, index) => {
      acc[`#attr${index}`] = attr;
      return acc;
    }, {});

    const expressionAttributeValues = Object.values(updates).reduce((acc: Record<string, any>, val, index) => {
      acc[`:val${index}`] = val;
      return acc;
    }, {});

    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await this.client.send(command);
    return response.Attributes;
  }

  async deleteItem(tableName: string, key: any): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('DynamoDB service not configured');
    }

    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });

    await this.client.send(command);
  }

  async queryItems(tableName: string, keyCondition: string, expressionAttributeValues: any, limit?: number): Promise<any[]> {
    if (!this.isConfigured) {
      throw new Error('DynamoDB service not configured');
    }

    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit,
      ScanIndexForward: false, // Sort in descending order (newest first)
    });

    const response = await this.client.send(command);
    return response.Items || [];
  }

  // Specific methods for financial data
  async getTransactionsByUserId(userId: string, limit?: number): Promise<any[]> {
    return this.queryItems(
      process.env.AWS_DYNAMODB_TRANSACTIONS_TABLE || 'dime-time-transactions',
      'userId = :userId',
      { ':userId': userId },
      limit
    );
  }

  async createTransaction(transaction: any): Promise<any> {
    const tableName = process.env.AWS_DYNAMODB_TRANSACTIONS_TABLE || 'dime-time-transactions';
    return this.putItem(tableName, {
      ...transaction,
      id: transaction.id || `trans-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }

  async getUserDebts(userId: string): Promise<any[]> {
    return this.queryItems(
      process.env.AWS_DYNAMODB_DEBTS_TABLE || 'dime-time-debts',
      'userId = :userId',
      { ':userId': userId }
    );
  }

  async createDebt(debt: any): Promise<any> {
    const tableName = process.env.AWS_DYNAMODB_DEBTS_TABLE || 'dime-time-debts';
    return this.putItem(tableName, {
      ...debt,
      id: debt.id || `debt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  }

  async getUserCryptoPurchases(userId: string): Promise<any[]> {
    return this.queryItems(
      process.env.AWS_DYNAMODB_CRYPTO_TABLE || 'dime-time-crypto-purchases',
      'userId = :userId',
      { ':userId': userId }
    );
  }

  async createCryptoPurchase(purchase: any): Promise<any> {
    const tableName = process.env.AWS_DYNAMODB_CRYPTO_TABLE || 'dime-time-crypto-purchases';
    return this.putItem(tableName, {
      ...purchase,
      id: purchase.id || `crypto-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  }

  // Backup and analytics methods
  async exportUserDataToS3(userId: string): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('DynamoDB service not configured');
    }

    const [transactions, debts, cryptoPurchases] = await Promise.all([
      this.getTransactionsByUserId(userId),
      this.getUserDebts(userId),
      this.getUserCryptoPurchases(userId),
    ]);

    const userData = {
      userId,
      exportDate: new Date().toISOString(),
      transactions,
      debts,
      cryptoPurchases,
    };

    // This would require S3 service integration
    return JSON.stringify(userData);
  }
}

export const dynamoService = new DynamoService();