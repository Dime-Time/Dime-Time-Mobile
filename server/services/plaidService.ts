import { PlaidApi, Configuration, PlaidEnvironments, CountryCode, Products } from 'plaid';
import { storage } from '../storage';

const configuration = new Configuration({
  basePath: process.env.PLAID_ENV === 'sandbox' ? PlaidEnvironments.sandbox : 
           process.env.PLAID_ENV === 'development' ? PlaidEnvironments.development : 
           PlaidEnvironments.production,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

const client = new PlaidApi(configuration);

export class PlaidService {
  async createLinkToken(userId: string) {
    try {
      const response = await client.linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: 'Dime Time',
        products: [Products.Transactions, Products.Auth],
        country_codes: [CountryCode.Us],
        language: 'en',
      });
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      throw new Error('Failed to create bank connection link');
    }
  }

  async exchangePublicToken(publicToken: string, userId: string) {
    try {
      const response = await client.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // Get account information
      const accountsResponse = await client.accountsGet({
        access_token: accessToken,
      });

      // Store bank accounts in database
      const savedAccounts = [];
      for (const account of accountsResponse.data.accounts) {
        const bankAccount = await storage.createBankAccount({
          userId,
          plaidItemId: itemId,
          plaidAccessToken: accessToken,
          accountId: account.account_id,
          accountName: account.name,
          accountType: account.type,
          institutionName: accountsResponse.data.item.institution_id || 'Unknown',
          mask: account.mask || null,
        });
        savedAccounts.push(bankAccount);
      }

      return savedAccounts;
    } catch (error) {
      console.error('Error exchanging Plaid public token:', error);
      throw new Error('Failed to connect bank account');
    }
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string) {
    try {
      const response = await client.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });

      return response.data.transactions.map(transaction => ({
        id: transaction.transaction_id,
        accountId: transaction.account_id,
        amount: Math.abs(transaction.amount),
        merchant: transaction.merchant_name || transaction.name,
        category: transaction.category?.[0] || 'Other',
        date: transaction.date,
        description: transaction.name,
      }));
    } catch (error) {
      console.error('Error fetching Plaid transactions:', error);
      throw new Error('Failed to fetch bank transactions');
    }
  }

  async getAccountBalances(accessToken: string) {
    try {
      const response = await client.accountsGet({
        access_token: accessToken,
      });

      return response.data.accounts.map(account => ({
        accountId: account.account_id,
        name: account.name,
        type: account.type,
        balance: account.balances.current || 0,
        availableBalance: account.balances.available || 0,
      }));
    } catch (error) {
      console.error('Error fetching account balances:', error);
      throw new Error('Failed to fetch account balances');
    }
  }
}

export const plaidService = new PlaidService();