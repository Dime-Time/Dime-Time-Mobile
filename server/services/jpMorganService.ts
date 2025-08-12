/**
 * JP Morgan Chase Banking Integration Service
 * Handles sweep account operations, interest calculations, and weekly dispersals
 */

export interface JPMorganConfig {
  apiKey: string;
  clientId: string;
  environment: 'sandbox' | 'production';
  sweepAccountId: string;
}

export interface SweepAccountBalance {
  accountId: string;
  currentBalance: number;
  availableBalance: number;
  interestRate: number;
  lastUpdated: Date;
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
  reference: string;
  description?: string;
}

export interface TransferResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  timestamp: Date;
  reference: string;
}

export class JPMorganService {
  private config: JPMorganConfig;
  private baseUrl: string;

  constructor(config: JPMorganConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.jpmorgan.com/v1' 
      : 'https://sandbox-api.jpmorgan.com/v1';
  }

  /**
   * Create a new sweep account for collecting round-ups
   */
  async createSweepAccount(userId: string, accountDetails: {
    accountType: string;
    initialDeposit?: number;
  }): Promise<{
    accountId: string;
    accountNumber: string;
    routingNumber: string;
  }> {
    // In a real implementation, this would make an API call to JP Morgan
    // For demo purposes, we'll return mock data
    return {
      accountId: `JPM_${Date.now()}_${userId.slice(0, 8)}`,
      accountNumber: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      routingNumber: '021000021', // JP Morgan Chase routing number
    };
  }

  /**
   * Deposit round-up amounts into the sweep account
   */
  async depositRoundUp(accountId: string, amount: number, reference: string): Promise<TransferResponse> {
    // Simulate API call to JP Morgan for depositing round-ups
    const response: TransferResponse = {
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      amount,
      timestamp: new Date(),
      reference,
    };

    console.log(`[JP Morgan] Deposited $${amount} round-up to account ${accountId}`);
    return response;
  }

  /**
   * Get current sweep account balance with accrued interest
   */
  async getSweepAccountBalance(accountId: string): Promise<SweepAccountBalance> {
    // Simulate API call to get account balance
    return {
      accountId,
      currentBalance: Math.random() * 1000 + 100, // Mock balance
      availableBalance: Math.random() * 1000 + 100,
      interestRate: 0.02 + Math.random() * 0.01, // 2-3% range
      lastUpdated: new Date(),
    };
  }

  /**
   * Calculate daily interest on sweep account balance
   */
  async calculateDailyInterest(accountId: string, principal: number, annualRate: number): Promise<number> {
    const dailyRate = annualRate / 365;
    const interest = principal * dailyRate;
    
    console.log(`[JP Morgan] Calculated daily interest: $${interest.toFixed(6)} on principal $${principal}`);
    return interest;
  }

  /**
   * Transfer funds from sweep account to debt payment
   */
  async disperseToDebtPayment(request: TransferRequest): Promise<TransferResponse> {
    // Simulate API call to JP Morgan for debt payment transfer
    const response: TransferResponse = {
      transactionId: `DISP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      amount: request.amount,
      timestamp: new Date(),
      reference: request.reference,
    };

    console.log(`[JP Morgan] Initiated dispersal of $${request.amount} from ${request.fromAccount} to ${request.toAccount}`);
    return response;
  }

  /**
   * Get transaction history for sweep account
   */
  async getTransactionHistory(accountId: string, startDate: Date, endDate: Date): Promise<any[]> {
    // Simulate API call to get transaction history
    return [
      {
        transactionId: 'TXN_001',
        type: 'deposit',
        amount: 2.50,
        description: 'Round-up deposit',
        timestamp: new Date(),
      },
      {
        transactionId: 'INT_001',
        type: 'interest',
        amount: 0.000137,
        description: 'Daily interest accrual',
        timestamp: new Date(),
      },
    ];
  }

  /**
   * Validate JP Morgan account credentials
   */
  async validateCredentials(): Promise<boolean> {
    try {
      // Simulate credential validation
      console.log('[JP Morgan] Validating API credentials...');
      return true;
    } catch (error) {
      console.error('[JP Morgan] Credential validation failed:', error);
      return false;
    }
  }
}

// Factory function to create JP Morgan service instance
export function createJPMorganService(): JPMorganService {
  const config: JPMorganConfig = {
    apiKey: process.env.JP_MORGAN_API_KEY || 'demo-key',
    clientId: process.env.JP_MORGAN_CLIENT_ID || 'demo-client',
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    sweepAccountId: process.env.JP_MORGAN_SWEEP_ACCOUNT_ID || 'demo-sweep-account',
  };

  return new JPMorganService(config);
}