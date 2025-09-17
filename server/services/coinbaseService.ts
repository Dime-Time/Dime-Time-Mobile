import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import crypto from 'crypto';
import { z } from 'zod';

// Input validation schemas
const accountIdSchema = z.string().min(1);
const amountSchema = z.string().regex(/^\d+(\.\d+)?$/);
const currencySchema = z.string().min(1).max(10);

interface CoinbaseAccount {
  id: string;
  name: string;
  primary: boolean;
  type: string;
  currency: string;
  balance: {
    amount: string;
    currency: string;
  };
}

interface CoinbaseTransaction {
  id: string;
  type: string;
  status: string;
  amount: {
    amount: string;
    currency: string;
  };
  native_amount: {
    amount: string;
    currency: string;
  };
  description: string;
  created_at: string;
  updated_at: string;
}

class CoinbaseApiClient {
  private axiosClient: AxiosInstance;
  private apiKey: string;
  private apiSecret: string;
  private passphrase: string;
  private baseURL = 'https://api.coinbase.com';
  private apiVersion = '2021-06-14';

  constructor(apiKey: string, apiSecret: string, passphrase: string = '') {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.passphrase = passphrase;
    
    this.axiosClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'CB-VERSION': this.apiVersion,
      },
    });

    // Add request interceptor for authentication
    this.axiosClient.interceptors.request.use((config) => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const method = (config.method || 'GET').toUpperCase();
      const requestPath = config.url || '';
      const body = config.data ? JSON.stringify(config.data) : '';

      const signature = this.generateSignature(timestamp, method, requestPath, body);

      Object.assign(config.headers || {}, {
        'CB-ACCESS-KEY': this.apiKey,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-PASSPHRASE': this.passphrase,
      });

      return config;
    });
  }

  /**
   * Generate HMAC signature for Coinbase API authentication
   */
  private generateSignature(timestamp: string, method: string, requestPath: string, body: string): string {
    try {
      // Create the prehash string
      const message = timestamp + method + requestPath + body;
      
      // Decode the base64 secret
      const key = Buffer.from(this.apiSecret, 'base64');
      
      // Create HMAC SHA-256 signature
      const hmac = crypto.createHmac('sha256', key);
      const signature = hmac.update(message, 'utf8').digest('base64');
      
      return signature;
    } catch (error) {
      console.error('Error generating HMAC signature:', error);
      throw new Error('Failed to generate API signature');
    }
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(method: string, endpoint: string, data?: any): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method: method.toLowerCase() as any,
        url: endpoint,
      };

      if (data) {
        config.data = data;
      }

      const response = await this.axiosClient.request<{ data: T }>(config);
      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        const errorData = error.response.data;
        console.error('Coinbase API Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: errorData,
        });
        throw new Error(
          `Coinbase API Error: ${error.response.status} - ${errorData?.message || error.response.statusText}`
        );
      } else if (error.request) {
        console.error('Network Error:', error.message);
        throw new Error('Network error - Unable to connect to Coinbase API');
      } else {
        console.error('Request Error:', error.message);
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  /**
   * Get all user accounts
   */
  async getAccounts(): Promise<CoinbaseAccount[]> {
    return this.makeRequest<CoinbaseAccount[]>('GET', '/v2/accounts');
  }

  /**
   * Get specific account by ID
   */
  async getAccount(accountId: string): Promise<CoinbaseAccount> {
    const validatedId = accountIdSchema.parse(accountId);
    return this.makeRequest<CoinbaseAccount>('GET', `/v2/accounts/${validatedId}`);
  }

  /**
   * Buy cryptocurrency
   */
  async buyCrypto(accountId: string, amount: string, currency: string = 'USD'): Promise<CoinbaseTransaction> {
    const validatedId = accountIdSchema.parse(accountId);
    const validatedAmount = amountSchema.parse(amount);
    const validatedCurrency = currencySchema.parse(currency);

    const buyData = {
      amount: validatedAmount,
      currency: validatedCurrency,
      commit: true,
    };

    return this.makeRequest<CoinbaseTransaction>('POST', `/v2/accounts/${validatedId}/buys`, buyData);
  }

  /**
   * Get exchange rates
   */
  async getExchangeRates(currency: string = 'BTC'): Promise<any> {
    const validatedCurrency = currencySchema.parse(currency);
    return this.makeRequest<any>('GET', `/v2/exchange-rates?currency=${validatedCurrency}`);
  }

  /**
   * Get spot price for currency pair
   */
  async getSpotPrice(currencyPair: string = 'BTC-USD'): Promise<any> {
    const validatedPair = z.string().min(1).parse(currencyPair);
    return this.makeRequest<any>('GET', `/v2/prices/${validatedPair}/spot`);
  }

  /**
   * Get account transactions
   */
  async getTransactions(accountId: string): Promise<CoinbaseTransaction[]> {
    const validatedId = accountIdSchema.parse(accountId);
    return this.makeRequest<CoinbaseTransaction[]>('GET', `/v2/accounts/${validatedId}/transactions`);
  }
}

class CoinbaseService {
  private client: CoinbaseApiClient | null = null;
  private isConfigured: boolean = false;

  constructor() {
    try {
      if (process.env.COINBASE_API_KEY && process.env.COINBASE_API_SECRET) {
        this.client = new CoinbaseApiClient(
          process.env.COINBASE_API_KEY,
          process.env.COINBASE_API_SECRET,
          process.env.COINBASE_PASSPHRASE || ''
        );
        this.isConfigured = true;
        console.log('✅ Coinbase service initialized with secure API client');
      } else {
        this.isConfigured = false;
        console.log('⚠️  Coinbase service not configured - missing API credentials');
      }
    } catch (error) {
      console.error('Failed to initialize Coinbase service:', error);
      this.isConfigured = false;
    }
  }

  async getAccounts() {
    if (!this.isConfigured || !this.client) {
      throw new Error('Coinbase service not configured. Please provide COINBASE_API_KEY and COINBASE_API_SECRET environment variables.');
    }

    try {
      const accounts = await this.client.getAccounts();
      return accounts;
    } catch (error) {
      console.error('Error fetching Coinbase accounts:', error);
      throw error;
    }
  }

  async getAccount(accountId: string) {
    if (!this.isConfigured || !this.client) {
      throw new Error('Coinbase service not configured');
    }

    try {
      const account = await this.client.getAccount(accountId);
      return account;
    } catch (error) {
      console.error('Error fetching Coinbase account:', error);
      throw error;
    }
  }

  async buyCrypto(accountId: string, amount: string, currency: string = 'USD') {
    if (!this.isConfigured || !this.client) {
      throw new Error('Coinbase service not configured');
    }

    try {
      const transaction = await this.client.buyCrypto(accountId, amount, currency);
      return transaction;
    } catch (error) {
      console.error('Error buying crypto:', error);
      throw error;
    }
  }

  async getExchangeRates(currency: string = 'BTC') {
    if (!this.isConfigured || !this.client) {
      throw new Error('Coinbase service not configured');
    }

    try {
      const rates = await this.client.getExchangeRates(currency);
      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }

  async getSpotPrice(currencyPair: string = 'BTC-USD') {
    if (!this.isConfigured || !this.client) {
      throw new Error('Coinbase service not configured');
    }

    try {
      const price = await this.client.getSpotPrice(currencyPair);
      return price;
    } catch (error) {
      console.error('Error fetching spot price:', error);
      throw error;
    }
  }

  async getTransactions(accountId: string) {
    if (!this.isConfigured || !this.client) {
      throw new Error('Coinbase service not configured');
    }

    try {
      const transactions = await this.client.getTransactions(accountId);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export const coinbaseService = new CoinbaseService();