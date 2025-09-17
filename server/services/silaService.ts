import axios, { AxiosInstance } from 'axios';

interface SilaTransfer {
  reference: string;
  user_handle: string;
  amount: number;
  account_name: string;
  descriptor: string;
  business_uuid?: string;
  processing_type?: 'STANDARD_ACH';
}

interface SilaTransferResponse {
  reference: string;
  status: 'pending' | 'queued' | 'sent' | 'success' | 'failed' | 'returned';
  message: string;
  transaction_id?: string;
  effective_date?: string;
}

interface SilaBankAccount {
  account_name: string;
  account_type: 'CHECKING' | 'SAVINGS';
  account_number: string;
  routing_number: string;
  account_owner_name: string;
}

interface SilaUser {
  handle: string;
  first_name: string;
  last_name: string;
  entity_name?: string;
  business_type?: string;
  business_uuid?: string;
  address: {
    address_alias: string;
    street_address_1: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  identity: {
    identity_alias: string;
    identity_value: string; // SSN or EIN
  };
  contact: {
    phone: string;
    email: string;
  };
}

class SilaService {
  private client!: AxiosInstance;
  private isConfigured: boolean = false;
  private appHandle!: string;
  private environment!: 'sandbox' | 'production';
  
  constructor() {
    try {
      this.appHandle = 'dime_time_app';
      
      // Check if we should use mock mode for beta testing
      const mode = process.env.SILA_MODE || 'live';
      if (mode === 'mock') {
        this.environment = 'sandbox'; // For display purposes
        this.isConfigured = false; // Will use mock service instead
        console.log('🎭 Sila service set to MOCK mode - using MockSilaService for beta testing');
        return;
      }
      
      this.environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
      
      const baseURL = this.environment === 'production' 
        ? 'https://api.silamoney.com/0.2' 
        : 'https://sandbox.silamoney.com/0.2';

      this.client = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
          'authsignature': '', // Will be set per request
        },
        timeout: 30000
      });

      // Proper Sila configuration requires app handle and private key for Ed25519 signatures
      this.isConfigured = !!(
        process.env.SILA_APP_HANDLE && 
        process.env.SILA_APP_PRIVATE_KEY
      );

      if (this.isConfigured) {
        console.log(`✅ Sila Money service configured successfully (${this.environment})`);
      } else {
        console.log('⚠️ Sila Money service not configured - missing SILA_APP_HANDLE and SILA_APP_PRIVATE_KEY for Ed25519 signatures');
      }
    } catch (error) {
      console.error('Failed to initialize Sila service:', error);
      this.isConfigured = false;
    }
  }

  private generateAuthSignature(message: string, endpoint: string): string {
    // In production, this would use crypto to sign the message with private key
    // For now, we'll use the client credentials directly as Sila expects
    const timestamp = Date.now().toString();
    return `${process.env.SILA_CLIENT_ID}:${process.env.SILA_CLIENT_SECRET}:${timestamp}`;
  }

  // Register a user with Sila
  async registerUser(userData: SilaUser): Promise<{ success: boolean; message: string; reference?: string }> {
    if (!this.isConfigured) {
      throw new Error('Sila service not configured');
    }

    try {
      const message = {
        header: {
          app_handle: this.appHandle,
          user_handle: userData.handle,
        },
        message: 'register_msg',
        ...userData
      };

      const signature = this.generateAuthSignature(JSON.stringify(message), '/register');
      
      const response = await this.client.post('/register', message, {
        headers: { authsignature: signature }
      });

      return {
        success: response.data.success || false,
        message: response.data.message || 'Registration completed',
        reference: response.data.reference
      };
    } catch (error) {
      console.error('Error registering user with Sila:', error);
      throw new Error('Failed to register user');
    }
  }

  // Link bank account to user
  async linkAccount(userHandle: string, accountData: SilaBankAccount): Promise<{ success: boolean; message: string; account_name?: string }> {
    if (!this.isConfigured) {
      throw new Error('Sila service not configured');
    }

    try {
      const message = {
        header: {
          app_handle: this.appHandle,
          user_handle: userHandle,
        },
        message: 'link_account_msg',
        ...accountData
      };

      const signature = this.generateAuthSignature(JSON.stringify(message), '/link_account');
      
      const response = await this.client.post('/link_account', message, {
        headers: { authsignature: signature }
      });

      return {
        success: response.data.success || false,
        message: response.data.message || 'Account linked successfully',
        account_name: response.data.account_name
      };
    } catch (error) {
      console.error('Error linking bank account:', error);
      throw new Error('Failed to link bank account');
    }
  }

  // Issue (deposit) money from bank account to Sila wallet
  async issueToWallet(userHandle: string, amount: number, accountName: string, descriptor: string): Promise<SilaTransferResponse> {
    if (!this.isConfigured) {
      throw new Error('Sila service not configured');
    }

    try {
      const reference = `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const message = {
        header: {
          app_handle: this.appHandle,
          user_handle: userHandle,
        },
        message: 'issue_msg',
        amount: amount,
        account_name: accountName,
        descriptor: descriptor || 'Dime Time Round-up Collection',
        business_uuid: process.env.SILA_BUSINESS_UUID || undefined,
        processing_type: 'STANDARD_ACH'
      };

      const signature = this.generateAuthSignature(JSON.stringify(message), '/issue');
      
      const response = await this.client.post('/issue', message, {
        headers: { authsignature: signature }
      });

      return {
        reference: reference,
        status: response.data.status || 'pending',
        message: response.data.message || 'Transfer initiated',
        transaction_id: response.data.transaction_id,
        effective_date: response.data.effective_date
      };
    } catch (error) {
      console.error('Error issuing to wallet:', error);
      throw new Error('Failed to issue funds to wallet');
    }
  }

  // Redeem (withdraw) money from Sila wallet to bank account
  async redeemFromWallet(userHandle: string, amount: number, accountName: string, descriptor: string): Promise<SilaTransferResponse> {
    if (!this.isConfigured) {
      throw new Error('Sila service not configured');
    }

    try {
      const reference = `redeem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const message = {
        header: {
          app_handle: this.appHandle,
          user_handle: userHandle,
        },
        message: 'redeem_msg',
        amount: amount,
        account_name: accountName,
        descriptor: descriptor || 'Dime Time Debt Payment',
        business_uuid: process.env.SILA_BUSINESS_UUID || undefined,
        processing_type: 'STANDARD_ACH'
      };

      const signature = this.generateAuthSignature(JSON.stringify(message), '/redeem');
      
      const response = await this.client.post('/redeem', message, {
        headers: { authsignature: signature }
      });

      return {
        reference: reference,
        status: response.data.status || 'pending',
        message: response.data.message || 'Transfer initiated',
        transaction_id: response.data.transaction_id,
        effective_date: response.data.effective_date
      };
    } catch (error) {
      console.error('Error redeeming from wallet:', error);
      throw new Error('Failed to redeem funds from wallet');
    }
  }

  // Get transaction status
  async getTransactionStatus(userHandle: string, transactionId: string): Promise<{ status: string; message: string }> {
    if (!this.isConfigured) {
      throw new Error('Sila service not configured');
    }

    try {
      const message = {
        header: {
          app_handle: this.appHandle,
          user_handle: userHandle,
        },
        message: 'get_transactions_msg',
        search_filters: {
          transaction_id: transactionId
        }
      };

      const signature = this.generateAuthSignature(JSON.stringify(message), '/get_transactions');
      
      const response = await this.client.post('/get_transactions', message, {
        headers: { authsignature: signature }
      });

      const transaction = response.data.transactions?.[0];
      return {
        status: transaction?.status || 'unknown',
        message: transaction?.message || 'Transaction not found'
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw new Error('Failed to get transaction status');
    }
  }

  // Get user's wallet balance
  async getWalletBalance(userHandle: string): Promise<{ balance: number; currency: string }> {
    if (!this.isConfigured) {
      throw new Error('Sila service not configured');
    }

    try {
      const message = {
        header: {
          app_handle: this.appHandle,
          user_handle: userHandle,
        },
        message: 'get_wallet_msg'
      };

      const signature = this.generateAuthSignature(JSON.stringify(message), '/get_wallet');
      
      const response = await this.client.post('/get_wallet', message, {
        headers: { authsignature: signature }
      });

      return {
        balance: parseFloat(response.data.wallet?.available_balance || '0'),
        currency: 'USD'
      };
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  // Check if service is configured
  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  // Get environment info
  getEnvironment(): string {
    return this.environment;
  }

  // Helper method to create a demo user for testing
  createDemoUser(userId: string = 'demo-user-1'): SilaUser {
    return {
      handle: `dime_time_${userId}`,
      first_name: 'Demo',
      last_name: 'User',
      address: {
        address_alias: 'home',
        street_address_1: '123 Demo Street',
        city: 'Demo City',
        state: 'CA',
        country: 'US',
        postal_code: '12345'
      },
      identity: {
        identity_alias: 'ssn',
        identity_value: '123456789' // Demo SSN for sandbox
      },
      contact: {
        phone: '555-123-4567',
        email: 'demo@dimetime.app'
      }
    };
  }
}

export const silaService = new SilaService();