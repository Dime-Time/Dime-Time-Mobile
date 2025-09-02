import { Client } from 'coinbase';

class CoinbaseService {
  private client: any;
  private isConfigured: boolean = false;

  constructor() {
    try {
      if (process.env.COINBASE_API_KEY && process.env.COINBASE_API_SECRET) {
        // Secure SSL configuration for production fintech app
        this.client = new Client({
          apiKey: process.env.COINBASE_API_KEY,
          apiSecret: process.env.COINBASE_API_SECRET,
          strictSSL: true, // Secure SSL for production
          version: '2021-06-14', // Use stable API version
        });
        this.isConfigured = true;
      } else {
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('Failed to initialize Coinbase service:', error);
      // If SSL issues occur, log detailed error for debugging
      if (error instanceof Error && error.message.includes('certificate')) {
        console.error('SSL Certificate issue detected. Check network/firewall configuration.');
      }
      this.isConfigured = false;
    }
  }

  async getAccounts() {
    if (!this.isConfigured) {
      throw new Error('Coinbase service not configured. Please provide COINBASE_API_KEY and COINBASE_API_SECRET environment variables.');
    }

    return new Promise((resolve, reject) => {
      this.client.getAccounts({}, (err: any, accounts: any) => {
        if (err) {
          console.error('Error fetching Coinbase accounts:', err);
          reject(err);
        } else {
          resolve(accounts);
        }
      });
    });
  }

  async getAccount(accountId: string) {
    if (!this.isConfigured) {
      throw new Error('Coinbase service not configured');
    }

    return new Promise((resolve, reject) => {
      this.client.getAccount(accountId, (err: any, account: any) => {
        if (err) {
          console.error('Error fetching Coinbase account:', err);
          reject(err);
        } else {
          resolve(account);
        }
      });
    });
  }

  async buyCrypto(accountId: string, amount: string, currency: string = 'USD') {
    if (!this.isConfigured) {
      throw new Error('Coinbase service not configured');
    }

    return new Promise((resolve, reject) => {
      this.client.getAccount(accountId, (err: any, account: any) => {
        if (err) {
          reject(err);
          return;
        }

        account.buy({
          amount: amount,
          currency: currency,
          commit: true
        }, (buyErr: any, tx: any) => {
          if (buyErr) {
            console.error('Error buying crypto:', buyErr);
            reject(buyErr);
          } else {
            resolve(tx);
          }
        });
      });
    });
  }

  async getExchangeRates(currency: string = 'BTC') {
    if (!this.isConfigured) {
      throw new Error('Coinbase service not configured');
    }

    return new Promise((resolve, reject) => {
      this.client.getExchangeRates({ currency }, (err: any, rates: any) => {
        if (err) {
          console.error('Error fetching exchange rates:', err);
          reject(err);
        } else {
          resolve(rates);
        }
      });
    });
  }

  async getSpotPrice(currencyPair: string = 'BTC-USD') {
    if (!this.isConfigured) {
      throw new Error('Coinbase service not configured');
    }

    return new Promise((resolve, reject) => {
      this.client.getSpotPrice({ currencyPair }, (err: any, price: any) => {
        if (err) {
          console.error('Error fetching spot price:', err);
          reject(err);
        } else {
          resolve(price);
        }
      });
    });
  }

  async getTransactions(accountId: string) {
    if (!this.isConfigured) {
      throw new Error('Coinbase service not configured');
    }

    return new Promise((resolve, reject) => {
      this.client.getAccount(accountId, (err: any, account: any) => {
        if (err) {
          reject(err);
          return;
        }

        account.getTransactions(null, (txErr: any, transactions: any) => {
          if (txErr) {
            console.error('Error fetching transactions:', txErr);
            reject(txErr);
          } else {
            resolve(transactions);
          }
        });
      });
    });
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export const coinbaseService = new CoinbaseService();