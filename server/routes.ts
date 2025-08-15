import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dimeTokenService } from "./services/dimeTokenService";

import { insertTransactionSchema, insertPaymentSchema, insertDebtSchema, insertCryptoPurchaseSchema, insertRoundUpSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { plaidService } from "./services/plaidService";
import { coinbaseService } from "./services/coinbaseService";

export async function registerRoutes(app: Express): Promise<Server> {

  // Get current user (demo user)
  app.get("/api/user", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's debts
  app.get("/api/debts", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const debts = await storage.getDebtsByUserId(userId);
      res.json(debts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getTransactionsByUserId(userId, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId,
      });
      
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's payments
  app.get("/api/payments", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const payments = await storage.getPaymentsByUserId(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new payment
  app.post("/api/payments", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const validatedData = insertPaymentSchema.parse({
        ...req.body,
        userId,
      });
      
      const payment = await storage.createPayment(validatedData);
      
      // Update debt balance
      const debt = await storage.getDebt(validatedData.debtId);
      if (debt) {
        const newBalance = (parseFloat(debt.currentBalance) - parseFloat(validatedData.amount)).toFixed(2);
        await storage.updateDebt(validatedData.debtId, {
          currentBalance: newBalance,
        });
      }
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // One-tap accelerated payment
  app.post("/api/accelerated-payment", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const { debtId, amount } = req.body;
      
      if (!debtId || !amount) {
        return res.status(400).json({ message: "debtId and amount are required" });
      }

      const result = await storage.makeAcceleratedPayment(userId, debtId, amount);
      
      res.json({
        success: true,
        payment: result.payment,
        updatedDebt: result.updatedDebt,
        message: `Successfully paid $${amount} toward ${result.updatedDebt.name}`
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get round-up settings
  app.get("/api/round-up-settings", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const settings = await storage.getRoundUpSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update round-up settings
  app.put("/api/round-up-settings", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const settings = await storage.createOrUpdateRoundUpSettings({
        ...req.body,
        userId,
      });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Apply round-ups to debt
  app.post("/api/apply-round-ups", async (req: any, res) => {
    try {
      const { debtId, amount } = req.body;
      
      if (!debtId || !amount) {
        return res.status(400).json({ message: "debtId and amount are required" });
      }

      // Create payment record
      const userId = "demo-user-1";
      const payment = await storage.createPayment({
        userId,
        debtId,
        amount,
        source: "round_up",
      });

      // Update debt balance
      const debt = await storage.getDebt(debtId);
      if (debt) {
        const newBalance = (parseFloat(debt.currentBalance) - parseFloat(amount)).toFixed(2);
        await storage.updateDebt(debtId, {
          currentBalance: newBalance,
        });
      }

      res.json({ success: true, payment });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get dashboard summary
  app.get("/api/dashboard-summary", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const [debts, transactions, payments] = await Promise.all([
        storage.getDebtsByUserId(userId),
        storage.getTransactionsByUserId(userId),
        storage.getPaymentsByUserId(userId),
      ]);

      const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.currentBalance), 0);
      const totalRoundUps = transactions.reduce((sum, trans) => sum + parseFloat(trans.roundUpAmount), 0);
      
      // Calculate this month's round-ups
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthRoundUps = transactions
        .filter(trans => trans.date >= thisMonth)
        .reduce((sum, trans) => sum + parseFloat(trans.roundUpAmount), 0);

      // Calculate this month's debt payments
      const thisMonthPayments = payments
        .filter(payment => payment.date >= thisMonth)
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      // Calculate progress (simplified)
      const totalOriginalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.originalBalance), 0);
      const progressPercentage = totalOriginalDebt > 0 
        ? Math.round(((totalOriginalDebt - totalDebt) / totalOriginalDebt) * 100)
        : 0;

      // Estimate debt-free date (simplified calculation)
      const averageMonthlyPayment = thisMonthPayments || 500; // fallback
      const monthsToPayOff = Math.ceil(totalDebt / averageMonthlyPayment);
      const debtFreeDate = new Date();
      debtFreeDate.setMonth(debtFreeDate.getMonth() + monthsToPayOff);

      const summary = {
        totalDebt: totalDebt.toFixed(2),
        totalRoundUps: totalRoundUps.toFixed(2),
        thisMonthRoundUps: thisMonthRoundUps.toFixed(2),
        thisMonthPayments: thisMonthPayments.toFixed(2),
        progressPercentage,
        debtFreeDate: debtFreeDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        debtsCount: debts.length,
      };

      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's crypto purchases
  app.get("/api/crypto-purchases", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const purchases = await storage.getCryptoPurchasesByUserId(userId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new crypto purchase with real Coinbase integration
  app.post("/api/crypto-purchases", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const { amount, cryptoSymbol = "BTC" } = req.body;

      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      let purchase;
      
      if (coinbaseService.isServiceConfigured()) {
        try {
          // Get Coinbase accounts to find the primary account
          const accounts = await coinbaseService.getAccounts();
          const primaryAccount = (accounts as any).find((acc: any) => acc.primary) || (accounts as any)[0];
          
          if (primaryAccount) {
            // Execute real crypto purchase through Coinbase
            const coinbaseTransaction = await coinbaseService.buyCrypto(primaryAccount.id, amount, 'USD');
            
            // Store the real purchase in database
            purchase = await storage.createCryptoPurchase({
              userId,
              cryptoSymbol,
              amountUsd: amount,
              cryptoAmount: (coinbaseTransaction as any).amount?.amount || '0',
              purchasePrice: amount,
              coinbaseOrderId: (coinbaseTransaction as any).id || '',
            });

            res.status(201).json({
              ...purchase,
              coinbaseTransaction,
              message: "Real crypto purchase completed via Coinbase"
            });
          } else {
            throw new Error("No Coinbase account found");
          }
        } catch (coinbaseError) {
          console.error("Coinbase purchase failed:", coinbaseError);
          
          // Store failed attempt for tracking
          purchase = await storage.createCryptoPurchase({
            userId,
            cryptoSymbol,
            amountUsd: amount,
            cryptoAmount: '0',
            purchasePrice: amount,
          });

          res.status(503).json({
            ...purchase,
            error: coinbaseError,
            message: "Coinbase purchase failed - check API credentials"
          });
        }
      } else {
        // Demo mode when Coinbase not configured
        const cryptoAmount = (parseFloat(amount) / 50000).toFixed(8);
        purchase = await storage.createCryptoPurchase({
          userId,
          cryptoSymbol,
          amountUsd: amount,
          cryptoAmount,
          purchasePrice: amount,
        });

        res.status(201).json({
          ...purchase,
          message: "Demo purchase - Add Coinbase credentials for real trading"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid crypto purchase data", errors: error.errors });
      }
      console.error("Error creating crypto purchase:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get round-up settings
  app.get("/api/round-up-settings", async (req, res) => {
    try {
      const settings = await storage.getRoundUpSettings("demo-user-1");
      if (!settings) {
        return res.status(404).json({ message: "Round-up settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update round-up settings
  app.put("/api/round-up-settings", async (req, res) => {
    try {
      const validatedData = insertRoundUpSettingsSchema.parse({
        ...req.body,
        userId: "demo-user-1",
      });
      
      const settings = await storage.createOrUpdateRoundUpSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get crypto portfolio summary
  app.get("/api/crypto-summary", async (req: any, res) => {
    try {
      const userId = "demo-user-1";
      const purchases = await storage.getCryptoPurchasesByUserId(userId);
      const completedPurchases = purchases.filter(p => p.status === 'completed');
      
      // Group by crypto symbol
      const portfolio = completedPurchases.reduce((acc, purchase) => {
        const symbol = purchase.cryptoSymbol;
        if (!acc[symbol]) {
          acc[symbol] = {
            symbol,
            totalInvested: 0,
            totalCrypto: 0,
            averagePrice: 0,
            purchaseCount: 0
          };
        }
        
        acc[symbol].totalInvested += parseFloat(purchase.amountUsd);
        acc[symbol].totalCrypto += parseFloat(purchase.cryptoAmount);
        acc[symbol].purchaseCount += 1;
        
        return acc;
      }, {} as Record<string, any>);

      // Calculate average prices
      Object.values(portfolio).forEach((coin: any) => {
        coin.averagePrice = coin.totalInvested / coin.totalCrypto;
      });

      const totalInvested = completedPurchases.reduce((sum, p) => sum + parseFloat(p.amountUsd), 0);
      
      res.json({
        portfolio: Object.values(portfolio),
        totalInvested: totalInvested.toFixed(2),
        totalPurchases: completedPurchases.length,
        lastPurchase: completedPurchases[0]?.createdAt || null
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Plaid banking integration routes
  app.post("/api/plaid/create-link-token", async (req, res) => {
    try {
      const userId = "demo-user-1";
      
      if (!plaidService.isServiceConfigured()) {
        return res.status(503).json({ 
          message: "Plaid service not configured. Please provide PLAID_CLIENT_ID and PLAID_SECRET environment variables.",
          configured: false
        });
      }

      const linkToken = await plaidService.createLinkToken(userId);
      res.json({ linkToken, configured: true });
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      res.status(500).json({ message: "Failed to create link token" });
    }
  });

  app.post("/api/plaid/exchange-token", async (req, res) => {
    try {
      const { publicToken } = req.body;
      const userId = "demo-user-1";

      if (!publicToken) {
        return res.status(400).json({ message: "Public token is required" });
      }

      if (!plaidService.isServiceConfigured()) {
        return res.status(503).json({ message: "Plaid service not configured" });
      }

      const { accessToken, itemId } = await plaidService.exchangePublicToken(publicToken);
      
      // Get account information
      const accounts = await plaidService.getAccounts(accessToken);
      
      // Store bank account information in storage
      for (const account of accounts) {
        await storage.createBankAccount({
          userId,
          plaidItemId: itemId,
          plaidAccessToken: accessToken,
          accountId: account.account_id,
          accountName: account.name,
          accountType: account.type,
          institutionName: account.name, // You might want to fetch institution details
          mask: account.mask || '',
        });
      }

      res.json({ 
        success: true, 
        accounts: accounts.map(acc => ({
          id: acc.account_id,
          name: acc.name,
          type: acc.type,
          subtype: acc.subtype,
          mask: acc.mask
        }))
      });
    } catch (error) {
      console.error('Error exchanging Plaid token:', error);
      res.status(500).json({ message: "Failed to exchange token" });
    }
  });

  app.get("/api/plaid/accounts", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const bankAccounts = await storage.getBankAccountsByUserId(userId);
      res.json(bankAccounts);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      res.status(500).json({ message: "Failed to fetch bank accounts" });
    }
  });

  app.get("/api/plaid/transactions", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const bankAccounts = await storage.getBankAccountsByUserId(userId);
      
      if (bankAccounts.length === 0) {
        return res.json([]);
      }

      if (!plaidService.isServiceConfigured()) {
        return res.status(503).json({ message: "Plaid service not configured" });
      }

      // Get transactions from the last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const allTransactions = [];
      for (const account of bankAccounts) {
        try {
          const transactions = await plaidService.getTransactions(account.plaidAccessToken, startDate, endDate);
          allTransactions.push(...transactions);
        } catch (error) {
          console.error(`Error fetching transactions for account ${account.accountId}:`, error);
        }
      }

      res.json(allTransactions);
    } catch (error) {
      console.error('Error fetching Plaid transactions:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/plaid/balances", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const bankAccounts = await storage.getBankAccountsByUserId(userId);
      
      if (bankAccounts.length === 0) {
        return res.json([]);
      }

      if (!plaidService.isServiceConfigured()) {
        return res.status(503).json({ message: "Plaid service not configured" });
      }

      const allBalances = [];
      for (const account of bankAccounts) {
        try {
          const balances = await plaidService.getBalance(account.plaidAccessToken);
          allBalances.push(...balances);
        } catch (error) {
          console.error(`Error fetching balance for account ${account.accountId}:`, error);
        }
      }

      res.json(allBalances);
    } catch (error) {
      console.error('Error fetching account balances:', error);
      res.status(500).json({ message: "Failed to fetch balances" });
    }
  });

  // Coinbase cryptocurrency integration routes
  app.get("/api/coinbase/accounts", async (req, res) => {
    try {
      if (!coinbaseService.isServiceConfigured()) {
        return res.status(503).json({ 
          message: "Coinbase service not configured. Please provide COINBASE_API_KEY and COINBASE_API_SECRET environment variables.",
          configured: false
        });
      }

      const accounts = await coinbaseService.getAccounts();
      res.json({ accounts, configured: true });
    } catch (error) {
      console.error('Error fetching Coinbase accounts:', error);
      res.status(500).json({ message: "Failed to fetch Coinbase accounts" });
    }
  });

  app.get("/api/coinbase/prices/:currency?", async (req, res) => {
    try {
      const currency = req.params.currency || 'BTC';
      
      if (!coinbaseService.isServiceConfigured()) {
        return res.status(503).json({ 
          message: "Coinbase service not configured",
          configured: false
        });
      }

      const [spotPrice, exchangeRates] = await Promise.all([
        coinbaseService.getSpotPrice(`${currency}-USD`),
        coinbaseService.getExchangeRates(currency)
      ]);

      res.json({ spotPrice, exchangeRates, configured: true });
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      res.status(500).json({ message: "Failed to fetch crypto prices" });
    }
  });

  app.post("/api/coinbase/buy", async (req, res) => {
    try {
      const { accountId, amount, currency = 'USD' } = req.body;
      const userId = "demo-user-1";

      if (!accountId || !amount) {
        return res.status(400).json({ message: "Account ID and amount are required" });
      }

      if (!coinbaseService.isServiceConfigured()) {
        return res.status(503).json({ message: "Coinbase service not configured" });
      }

      const transaction = await coinbaseService.buyCrypto(accountId, amount, currency);
      
      // Store crypto purchase in our database
      await storage.createCryptoPurchase({
        userId,
        cryptoSymbol: 'BTC', // You might want to make this dynamic
        amountUsd: amount,
        cryptoAmount: '0', // Will be updated when transaction completes
        purchasePrice: amount,
        coinbaseOrderId: (transaction as any).id || '',
        status: 'pending'
      });

      res.json({ success: true, transaction });
    } catch (error) {
      console.error('Error buying crypto:', error);
      res.status(500).json({ message: "Failed to purchase cryptocurrency" });
    }
  });

  app.get("/api/coinbase/transactions/:accountId", async (req, res) => {
    try {
      const { accountId } = req.params;

      if (!coinbaseService.isServiceConfigured()) {
        return res.status(503).json({ message: "Coinbase service not configured" });
      }

      const transactions = await coinbaseService.getTransactions(accountId);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching Coinbase transactions:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/service-status", async (req, res) => {
    try {
      const status = {
        plaid: {
          configured: plaidService.isServiceConfigured(),
          status: plaidService.isServiceConfigured() ? 'ready' : 'missing_credentials'
        },
        coinbase: {
          configured: coinbaseService.isServiceConfigured(),
          status: coinbaseService.isServiceConfigured() ? 'ready' : 'missing_credentials'
        }
      };
      res.json(status);
    } catch (error) {
      console.error('Error checking service status:', error);
      res.status(500).json({ message: "Failed to check service status" });
    }
  });

  // Dime Time Token (DTT) API Routes
  app.get('/api/dime-token/info', async (req, res) => {
    try {
      const tokenInfo = dimeTokenService.getTokenInfo();
      res.json(tokenInfo);
    } catch (error) {
      console.error('Error fetching token info:', error);
      res.status(500).json({ message: 'Failed to fetch token information' });
    }
  });

  app.get('/api/dime-token/balance', async (req, res) => {
    try {
      const userId = "demo-user-1";
      // Mock balance data - in production would be from database
      const balance = {
        balance: '1250.75',
        stakedAmount: '500.00',
        totalEarned: '89.25'
      };
      res.json(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      res.status(500).json({ message: 'Failed to fetch token balance' });
    }
  });

  app.get('/api/dime-token/rewards', async (req, res) => {
    try {
      const userId = "demo-user-1";
      // Mock rewards data - in production would be from database
      const rewards = [
        {
          id: 'reward-1',
          action: 'round_up',
          amount: '2.5',
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
          id: 'reward-2',
          action: 'debt_payment',
          amount: '15.0',
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          id: 'reward-3',
          action: 'milestone',
          amount: '50.0',
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          createdAt: new Date(Date.now() - 604800000).toISOString() // 1 week ago
        }
      ];
      res.json(rewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      res.status(500).json({ message: 'Failed to fetch token rewards' });
    }
  });

  app.post('/api/dime-token/stake', async (req, res) => {
    try {
      const userId = "demo-user-1";
      const { amount, duration } = req.body;

      if (!amount || !duration || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'Valid amount and duration required' });
      }

      const stakingRewards = dimeTokenService.calculateStakingRewards(
        parseFloat(amount), 
        parseInt(duration)
      );

      const stakeData = {
        id: `stake-${Date.now()}`,
        userId,
        stakedAmount: amount,
        stakingDuration: parseInt(duration),
        apy: stakingRewards.apy.toString(),
        expectedRewards: stakingRewards.totalRewards.toString(),
        startDate: new Date().toISOString(),
        maturityDate: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };

      res.json({
        ...stakeData,
        message: `Successfully staked ${amount} DTT for ${duration} days at ${(stakingRewards.apy * 100).toFixed(1)}% APY`
      });
    } catch (error) {
      console.error('Error staking tokens:', error);
      res.status(500).json({ message: 'Failed to stake tokens' });
    }
  });

  app.get('/api/dime-token/trading-pairs', async (req, res) => {
    try {
      const tradingPairs = dimeTokenService.getTradingPairs();
      res.json(tradingPairs);
    } catch (error) {
      console.error('Error fetching trading pairs:', error);
      res.status(500).json({ message: 'Failed to fetch trading pairs' });
    }
  });

  // Award DTT tokens for user actions (called internally)
  app.post('/api/dime-token/award', async (req, res) => {
    try {
      const { userId, action, amount } = req.body;
      
      const reward = await dimeTokenService.awardTokens(userId || "demo-user-1", action, amount);
      res.json(reward);
    } catch (error) {
      console.error('Error awarding tokens:', error);
      res.status(500).json({ message: 'Failed to award tokens' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
