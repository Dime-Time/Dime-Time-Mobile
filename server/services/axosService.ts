import axios, { AxiosInstance } from 'axios';

interface AxosAccount {
  id: string;
  name: string;
  type: 'business_checking' | 'business_savings';
  balance: string;
  interestRate: string;
  routingNumber: string;
  accountNumber: string;
}

interface ACHTransfer {
  id: string;
  amount: string;
  fromAccount: string;
  toAccount: string;
  routingNumber: string;
  type: 'debit' | 'credit';
  status: 'pending' | 'completed' | 'failed';
  effectiveDate: string;
  description: string;
}

interface BulkPayment {
  id: string;
  totalAmount: string;
  transferCount: number;
  status: 'processing' | 'completed' | 'failed';
  scheduledDate: string;
  completedDate?: string;
}

class AxosService {
  private client!: AxiosInstance;
  private isConfigured: boolean = false;
  private businessAccountId: string = '';
  
  constructor() {
    try {
      // Initialize Axos API client
      this.client = axios.create({
        baseURL: 'https://api.axosbank.com/v1',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AXOS_API_KEY}`,
          'X-Client-ID': process.env.AXOS_CLIENT_ID
        },
        timeout: 30000
      });

      this.businessAccountId = process.env.AXOS_BUSINESS_ACCOUNT_ID || '';
      this.isConfigured = !!(
        process.env.AXOS_API_KEY && 
        process.env.AXOS_CLIENT_ID && 
        process.env.AXOS_BUSINESS_ACCOUNT_ID
      );

      if (this.isConfigured) {
        console.log('✅ Axos Bank service configured successfully');
      } else {
        console.log('⚠️ Axos Bank service not configured - missing credentials');
      }
    } catch (error) {
      console.error('Failed to initialize Axos service:', error);
      this.isConfigured = false;
    }
  }

  // Get business account details and current balance
  async getBusinessAccount(): Promise<AxosAccount> {
    if (!this.isConfigured) {
      throw new Error('Axos service not configured. Please provide AXOS_API_KEY, AXOS_CLIENT_ID, and AXOS_BUSINESS_ACCOUNT_ID environment variables.');
    }

    try {
      const response = await this.client.get(`/accounts/${this.businessAccountId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business account:', error);
      throw new Error('Failed to fetch business account details');
    }
  }

  // Collect round-up from user's bank account to business account
  async collectRoundUp(
    userAccountId: string, 
    userRoutingNumber: string, 
    amount: string,
    description: string = 'Dime Time Round-up Collection'
  ): Promise<ACHTransfer> {
    if (!this.isConfigured) {
      throw new Error('Axos service not configured');
    }

    try {
      const transferData = {
        amount: amount,
        fromAccount: userAccountId,
        fromRoutingNumber: userRoutingNumber,
        toAccount: this.businessAccountId,
        type: 'debit', // Debit from user account
        description: description,
        effectiveDate: new Date().toISOString().split('T')[0], // Same day
        source: 'round_up_collection'
      };

      const response = await this.client.post('/transfers/ach', transferData);
      return response.data;
    } catch (error) {
      console.error('Error collecting round-up:', error);
      throw new Error('Failed to collect round-up funds');
    }
  }

  // Pay user's debt from business account
  async payUserDebt(
    debtAccountId: string,
    debtRoutingNumber: string,
    amount: string,
    userId: string,
    debtName: string
  ): Promise<ACHTransfer> {
    if (!this.isConfigured) {
      throw new Error('Axos service not configured');
    }

    try {
      const transferData = {
        amount: amount,
        fromAccount: this.businessAccountId,
        toAccount: debtAccountId,
        toRoutingNumber: debtRoutingNumber,
        type: 'credit', // Credit to debt account
        description: `Dime Time Payment - ${debtName} for User ${userId}`,
        effectiveDate: new Date().toISOString().split('T')[0],
        source: 'debt_payment'
      };

      const response = await this.client.post('/transfers/ach', transferData);
      return response.data;
    } catch (error) {
      console.error('Error paying user debt:', error);
      throw new Error('Failed to pay user debt');
    }
  }

  // Process bulk weekly payments (every Friday)
  async processBulkWeeklyPayments(payments: Array<{
    userId: string;
    debtAccountId: string;
    debtRoutingNumber: string;
    amount: string;
    debtName: string;
  }>): Promise<BulkPayment> {
    if (!this.isConfigured) {
      throw new Error('Axos service not configured');
    }

    try {
      const totalAmount = payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0).toFixed(2);

      const bulkTransferData = {
        fromAccount: this.businessAccountId,
        payments: payments.map(payment => ({
          toAccount: payment.debtAccountId,
          toRoutingNumber: payment.debtRoutingNumber,
          amount: payment.amount,
          description: `Dime Time Weekly Payment - ${payment.debtName}`,
          userId: payment.userId
        })),
        scheduledDate: this.getNextFriday(),
        totalAmount: totalAmount,
        type: 'bulk_debt_payment'
      };

      const response = await this.client.post('/transfers/bulk-ach', bulkTransferData);
      return response.data;
    } catch (error) {
      console.error('Error processing bulk payments:', error);
      throw new Error('Failed to process bulk weekly payments');
    }
  }

  // Calculate 4% APY interest on business account balance
  async calculateInterestEarned(principalAmount: string, days: number): Promise<string> {
    const principal = parseFloat(principalAmount);
    const annualRate = 0.04; // 4% APY
    const dailyRate = annualRate / 365;
    const interest = principal * dailyRate * days;
    return interest.toFixed(2);
  }

  // Get transfer status and history
  async getTransferStatus(transferId: string): Promise<ACHTransfer> {
    if (!this.isConfigured) {
      throw new Error('Axos service not configured');
    }

    try {
      const response = await this.client.get(`/transfers/${transferId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transfer status:', error);
      throw new Error('Failed to fetch transfer status');
    }
  }

  // Get account transaction history
  async getAccountTransactions(
    startDate: string, 
    endDate: string, 
    limit: number = 100
  ): Promise<ACHTransfer[]> {
    if (!this.isConfigured) {
      throw new Error('Axos service not configured');
    }

    try {
      const response = await this.client.get(`/accounts/${this.businessAccountId}/transactions`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          limit: limit
        }
      });
      return response.data.transactions;
    } catch (error) {
      console.error('Error fetching account transactions:', error);
      throw new Error('Failed to fetch account transactions');
    }
  }

  // Helper function to get next Friday date
  private getNextFriday(): string {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));
    return nextFriday.toISOString().split('T')[0];
  }

  // Verify if service is properly configured
  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  // Get business account ID for external use
  getBusinessAccountId(): string {
    return this.businessAccountId;
  }
}

export const axosService = new AxosService();