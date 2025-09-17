// Mock Sila Service for Beta Testing
// Simulates real Sila API responses without requiring cryptographic signatures

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

class MockSilaService {
  private isConfigured: boolean = false;
  private environment: 'sandbox' | 'production' | 'mock';
  private mockDatabase: Map<string, any> = new Map(); // Simple in-memory store for mock data
  
  constructor() {
    this.environment = 'mock';
    this.isConfigured = true; // Mock is always "configured"
    console.log('✅ Sila Money service configured successfully (MOCK MODE for beta testing)');
  }

  // Register a user (mock implementation)
  async registerUser(userData: SilaUser): Promise<{ success: boolean; message: string; reference?: string }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const reference = `MOCK_REG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store user data in mock database
    this.mockDatabase.set(`user:${userData.handle}`, {
      ...userData,
      reference,
      status: 'verified',
      created_at: new Date().toISOString()
    });

    // Initialize wallet balance to 0
    this.mockDatabase.set(`wallet:${userData.handle}`, {
      balance: 0,
      currency: 'USD',
      last_updated: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Entity successfully registered.',
      reference
    };
  }

  // Link bank account (mock implementation)
  async linkAccount(userHandle: string, accountData: SilaBankAccount): Promise<{ success: boolean; message: string; account_name?: string }> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Store account data in mock database
    this.mockDatabase.set(`account:${userHandle}:${accountData.account_name}`, {
      ...accountData,
      status: 'active',
      verification_status: 'verified',
      created_at: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Bank account successfully linked and verified.',
      account_name: accountData.account_name
    };
  }

  // Issue money (collect roundup - mock implementation)
  async issueToWallet(userHandle: string, amount: number, accountName: string, descriptor: string): Promise<SilaTransferResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const reference = `MOCK_ISSUE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionId = `TXN_${Date.now()}`;
    
    // Update mock wallet balance
    const walletKey = `wallet:${userHandle}`;
    const wallet = this.mockDatabase.get(walletKey) || { balance: 0, currency: 'USD' };
    wallet.balance += amount;
    wallet.last_updated = new Date().toISOString();
    this.mockDatabase.set(walletKey, wallet);
    
    // Store transaction record
    this.mockDatabase.set(`transaction:${transactionId}`, {
      reference,
      user_handle: userHandle,
      amount,
      type: 'issue',
      status: 'success',
      descriptor,
      account_name: accountName,
      effective_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    return {
      reference,
      status: 'success',
      message: `Successfully collected $${amount.toFixed(2)} roundup`,
      transaction_id: transactionId,
      effective_date: new Date().toISOString()
    };
  }

  // Redeem money (pay debt - mock implementation)
  async redeemFromWallet(userHandle: string, amount: number, accountName: string, descriptor: string): Promise<SilaTransferResponse> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const reference = `MOCK_REDEEM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionId = `TXN_${Date.now()}`;
    
    // Check wallet balance
    const walletKey = `wallet:${userHandle}`;
    const wallet = this.mockDatabase.get(walletKey) || { balance: 0, currency: 'USD' };
    
    if (wallet.balance < amount) {
      return {
        reference,
        status: 'failed',
        message: `Insufficient funds. Wallet balance: $${wallet.balance.toFixed(2)}, requested: $${amount.toFixed(2)}`,
        transaction_id: transactionId
      };
    }
    
    // Update mock wallet balance
    wallet.balance -= amount;
    wallet.last_updated = new Date().toISOString();
    this.mockDatabase.set(walletKey, wallet);
    
    // Store transaction record
    this.mockDatabase.set(`transaction:${transactionId}`, {
      reference,
      user_handle: userHandle,
      amount,
      type: 'redeem',
      status: 'success',
      descriptor,
      account_name: accountName,
      effective_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    return {
      reference,
      status: 'success',
      message: `Successfully paid $${amount.toFixed(2)} towards debt`,
      transaction_id: transactionId,
      effective_date: new Date().toISOString()
    };
  }

  // Get transaction status (mock implementation)
  async getTransactionStatus(userHandle: string, transactionId: string): Promise<{ status: string; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const transaction = this.mockDatabase.get(`transaction:${transactionId}`);
    
    if (!transaction) {
      return {
        status: 'not_found',
        message: 'Transaction not found'
      };
    }

    return {
      status: transaction.status,
      message: `Transaction ${transaction.type} of $${transaction.amount.toFixed(2)} is ${transaction.status}`
    };
  }

  // Get wallet balance (mock implementation)
  async getWalletBalance(userHandle: string): Promise<{ balance: number; currency: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const wallet = this.mockDatabase.get(`wallet:${userHandle}`) || { balance: 0, currency: 'USD' };
    
    return {
      balance: wallet.balance,
      currency: wallet.currency
    };
  }

  // Service status methods
  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

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
        identity_value: '123456789' // Demo SSN for testing
      },
      contact: {
        phone: '555-123-4567',
        email: 'demo@dimetime.app'
      }
    };
  }

  // Mock-specific methods for testing and debugging
  getMockDatabase(): Map<string, any> {
    return this.mockDatabase;
  }

  clearMockDatabase(): void {
    this.mockDatabase.clear();
    console.log('🧹 Mock Sila database cleared');
  }

  // Simulate various transaction states for testing
  async simulateTransactionState(transactionId: string, newStatus: 'pending' | 'queued' | 'sent' | 'success' | 'failed' | 'returned'): Promise<boolean> {
    const transaction = this.mockDatabase.get(`transaction:${transactionId}`);
    if (!transaction) {
      return false;
    }
    
    transaction.status = newStatus;
    transaction.updated_at = new Date().toISOString();
    this.mockDatabase.set(`transaction:${transactionId}`, transaction);
    
    console.log(`🎭 Simulated transaction ${transactionId} status change to: ${newStatus}`);
    return true;
  }
}

export const mockSilaService = new MockSilaService();