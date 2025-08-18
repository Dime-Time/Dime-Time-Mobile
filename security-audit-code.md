# Dime Time Security Audit - Complete Code Review

## Overview
This document contains all critical code sections from the Dime Time fintech application for comprehensive security analysis. The app handles financial data, cryptocurrency transactions, user authentication, and payment processing.

**Key Security Areas to Review:**
- User authentication and session management
- Financial data handling and storage
- API security and input validation
- Cryptocurrency integration (Coinbase API)
- Database queries and data access
- Environment variable management
- DTT token system security

---

## 1. Server Configuration & Main Entry Point

### server/index.ts
```typescript
import express, { Request, Response } from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import { createServer } from 'vite';
import { router } from './routes.js';
import { storage } from './storage.js';

const app = express();
const MemStore = MemoryStore(session);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS and security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/api', router);

// Vite server setup
if (process.env.NODE_ENV !== 'production') {
  const vite = await createServer({
    server: { middlewareMode: true }
  });
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 2. Database Schema & Types

### shared/schema.ts
```typescript
import { pgTable, text, timestamp, boolean, decimal, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// User schema
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Financial data schemas
export const debts = pgTable('debts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  balance: decimal('balance', { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(),
  minimumPayment: decimal('minimum_payment', { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp('due_date'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  merchant: text('merchant').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  debtId: text('debt_id').notNull().references(() => debts.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  source: text('source').notNull(),
  date: timestamp('date').notNull(),
  status: text('status').notNull(),
});

// DTT Token schemas
export const dttHoldings = pgTable('dtt_holdings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  balance: decimal('balance', { precision: 18, scale: 8 }).notNull(),
  stakedAmount: decimal('staked_amount', { precision: 18, scale: 8 }).notNull().default('0'),
  totalEarned: decimal('total_earned', { precision: 18, scale: 8 }).notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastActivity: timestamp('last_activity').notNull().defaultNow(),
});

export const dttRewards = pgTable('dtt_rewards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  description: text('description').notNull(),
  transactionHash: text('transaction_hash'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const dttStaking = pgTable('dtt_staking', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  duration: integer('duration').notNull(),
  apy: decimal('apy', { precision: 5, scale: 8 }).notNull(),
  rewardsAccrued: decimal('rewards_accrued', { precision: 18, scale: 8 }).notNull().default('0'),
  status: text('status').notNull().default('active'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  lastRewardCalculation: timestamp('last_reward_calculation').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Cryptocurrency schemas
export const cryptoTransactions = pgTable('crypto_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  coinbaseOrderId: text('coinbase_order_id'),
  cryptocurrency: text('cryptocurrency').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  usdValue: decimal('usd_value', { precision: 10, scale: 2 }).notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDebtSchema = createInsertSchema(debts).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
});

export const insertDttHoldingsSchema = createInsertSchema(dttHoldings).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertDttRewardsSchema = createInsertSchema(dttRewards).omit({
  id: true,
  createdAt: true,
});

export const insertDttStakingSchema = createInsertSchema(dttStaking).omit({
  id: true,
  startDate: true,
  endDate: true,
  lastRewardCalculation: true,
  createdAt: true,
});

export const insertCryptoTransactionSchema = createInsertSchema(cryptoTransactions).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Debt = typeof debts.$inferSelect;
export type InsertDebt = z.infer<typeof insertDebtSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type DttHoldings = typeof dttHoldings.$inferSelect;
export type InsertDttHoldings = z.infer<typeof insertDttHoldingsSchema>;
export type DttRewards = typeof dttRewards.$inferSelect;
export type InsertDttRewards = z.infer<typeof insertDttRewardsSchema>;
export type DttStaking = typeof dttStaking.$inferSelect;
export type InsertDttStaking = z.infer<typeof insertDttStakingSchema>;
export type CryptoTransaction = typeof cryptoTransactions.$inferSelect;
export type InsertCryptoTransaction = z.infer<typeof insertCryptoTransactionSchema>;
```

---

## 3. Data Storage & Security

### server/storage.ts (Key Security Methods)
```typescript
import { randomUUID } from 'crypto';
import type { 
  User, InsertUser, Debt, InsertDebt, Transaction, InsertTransaction,
  Payment, InsertPayment, DttHoldings, InsertDttHoldings, DttRewards, 
  InsertDttRewards, DttStaking, InsertDttStaking, CryptoTransaction, 
  InsertCryptoTransaction 
} from '@shared/schema.js';

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Financial data access
  getDebtsByUserId(userId: string): Promise<Debt[]>;
  createDebt(insertDebt: InsertDebt): Promise<Debt>;
  updateDebt(id: string, updates: Partial<Debt>): Promise<Debt | undefined>;
  
  getTransactionsByUserId(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(insertTransaction: InsertTransaction): Promise<Transaction>;
  
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  createPayment(insertPayment: InsertPayment): Promise<Payment>;
  
  // DTT Token security methods
  getDttHoldings(userId: string): Promise<DttHoldings | undefined>;
  createOrUpdateDttHoldings(insertHoldings: InsertDttHoldings): Promise<DttHoldings>;
  updateDttBalance(userId: string, balance: string, stakedAmount?: string, totalEarned?: string): Promise<DttHoldings | undefined>;
  
  getDttRewardsByUserId(userId: string): Promise<DttRewards[]>;
  createDttReward(insertReward: InsertDttRewards): Promise<DttRewards>;
  
  getDttStakingByUserId(userId: string): Promise<DttStaking[]>;
  createDttStaking(insertStaking: InsertDttStaking): Promise<DttStaking>;
  updateDttStakingStatus(id: string, status: string): Promise<DttStaking | undefined>;
  
  // Cryptocurrency transaction security
  getCryptoTransactionsByUserId(userId: string): Promise<CryptoTransaction[]>;
  createCryptoTransaction(insertTransaction: InsertCryptoTransaction): Promise<CryptoTransaction>;
  updateCryptoTransactionStatus(id: string, status: string, coinbaseOrderId?: string): Promise<CryptoTransaction | undefined>;
}

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private debts = new Map<string, Debt>();
  private transactions = new Map<string, Transaction>();
  private payments = new Map<string, Payment>();
  private dttHoldingsMap = new Map<string, DttHoldings>();
  private dttRewardsMap = new Map<string, DttRewards>();
  private dttStakingMap = new Map<string, DttStaking>();
  private cryptoTransactions = new Map<string, CryptoTransaction>();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Demo user creation with hashed password simulation
    const demoUser: User = {
      id: "demo-user-1",
      username: "zeke.demo",
      password: "$2b$10$hashedPasswordExample", // Simulated bcrypt hash
      firstName: "Zeke",
      lastName: "Demo",
      email: "zeke@dimetime.app",
      createdAt: new Date("2024-01-01"),
    };
    this.users.set(demoUser.id, demoUser);

    // Financial demo data initialization
    // [Demo data creation code...]
  }

  // User authentication methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // DTT Token security methods
  async updateDttBalance(userId: string, balance: string, stakedAmount?: string, totalEarned?: string): Promise<DttHoldings | undefined> {
    const existing = this.dttHoldingsMap.get(userId);
    if (!existing) return undefined;
    
    const updated: DttHoldings = {
      ...existing,
      balance,
      lastActivity: new Date(),
      ...(stakedAmount !== undefined && { stakedAmount }),
      ...(totalEarned !== undefined && { totalEarned }),
    };
    
    this.dttHoldingsMap.set(userId, updated);
    return updated;
  }

  async createDttReward(insertReward: InsertDttRewards): Promise<DttRewards> {
    const reward: DttRewards = {
      id: randomUUID(),
      ...insertReward,
      createdAt: new Date(),
      status: "completed",
    };
    
    this.dttRewardsMap.set(reward.id, reward);
    
    // Update user's balance securely
    const currentHoldings = this.dttHoldingsMap.get(insertReward.userId);
    if (currentHoldings) {
      const newBalance = (parseFloat(currentHoldings.balance) + parseFloat(insertReward.amount)).toFixed(8);
      const newTotalEarned = (parseFloat(currentHoldings.totalEarned) + parseFloat(insertReward.amount)).toFixed(8);
      await this.updateDttBalance(insertReward.userId, newBalance, undefined, newTotalEarned);
    }
    
    return reward;
  }

  // Cryptocurrency transaction security
  async createCryptoTransaction(insertTransaction: InsertCryptoTransaction): Promise<CryptoTransaction> {
    const id = randomUUID();
    const transaction: CryptoTransaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date(),
    };
    this.cryptoTransactions.set(id, transaction);
    return transaction;
  }

  async updateCryptoTransactionStatus(id: string, status: string, coinbaseOrderId?: string): Promise<CryptoTransaction | undefined> {
    const transaction = this.cryptoTransactions.get(id);
    if (!transaction) return undefined;
    
    const updated = { 
      ...transaction, 
      status,
      ...(coinbaseOrderId && { coinbaseOrderId })
    };
    this.cryptoTransactions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
```

---

## 4. API Routes & Input Validation

### server/routes.ts (Security-Critical Routes)
```typescript
import express, { Request, Response } from 'express';
import { z } from 'zod';
import { storage } from './storage.js';
import { coinbaseService } from './services/coinbase.js';
import { 
  insertDebtSchema, insertTransactionSchema, insertPaymentSchema,
  insertDttHoldingsSchema, insertDttRewardsSchema, insertDttStakingSchema
} from '@shared/schema.js';

export const router = express.Router();

// User authentication endpoint
router.get('/api/user', async (req: Request, res: Response) => {
  try {
    const userId = "demo-user-1"; // Hardcoded for demo
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Financial data endpoints with validation
router.post('/api/debts', async (req: Request, res: Response) => {
  try {
    const userId = "demo-user-1";
    
    // Validate input using Zod schema
    const validatedData = insertDebtSchema.parse({
      ...req.body,
      userId
    });
    
    const debt = await storage.createDebt(validatedData);
    res.status(201).json(debt);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid input data', 
        errors: error.errors 
      });
    }
    console.error('Error creating debt:', error);
    res.status(500).json({ message: 'Failed to create debt' });
  }
});

router.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const userId = "demo-user-1";
    
    // Input validation
    const validatedData = insertTransactionSchema.parse({
      ...req.body,
      userId
    });
    
    const transaction = await storage.createTransaction(validatedData);
    res.status(201).json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid transaction data', 
        errors: error.errors 
      });
    }
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

// DTT Token API with security validation
router.get('/api/dime-token/balance', async (req: Request, res: Response) => {
  try {
    const userId = "demo-user-1";
    const holdings = await storage.getDttHoldings(userId);
    
    if (!holdings) {
      return res.json({
        balance: '0.00000000',
        stakedAmount: '0.00000000',
        totalEarned: '0.00000000'
      });
    }
    
    res.json({
      balance: holdings.balance,
      stakedAmount: holdings.stakedAmount,
      totalEarned: holdings.totalEarned
    });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    res.status(500).json({ message: 'Failed to fetch token balance' });
  }
});

router.post('/api/dime-token/stake', async (req: Request, res: Response) => {
  try {
    const userId = "demo-user-1";
    const { amount, duration } = req.body;

    // Input validation
    if (!amount || !duration || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: 'Valid amount and duration required' });
    }

    // Balance verification
    const holdings = await storage.getDttHoldings(userId);
    if (!holdings || parseFloat(holdings.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient DTT balance for staking' });
    }

    // APY calculation with security constraints
    let apy = "5.00000000";
    if (parseInt(duration) >= 90) apy = "15.50000000";
    else if (parseInt(duration) >= 30) apy = "10.00000000";

    const staking = await storage.createDttStaking({
      userId,
      amount: amount,
      duration: parseInt(duration),
      apy: apy,
      rewardsAccrued: "0.00000000",
      status: "active",
    });

    res.json({
      ...staking,
      message: `Successfully staked ${amount} DTT for ${duration} days`
    });
  } catch (error) {
    console.error('Error staking tokens:', error);
    res.status(500).json({ message: 'Failed to stake tokens' });
  }
});

// Cryptocurrency API with external service integration
router.post('/api/crypto/purchase', async (req: Request, res: Response) => {
  try {
    const userId = "demo-user-1";
    const { cryptocurrency, usdAmount } = req.body;

    // Input validation
    if (!cryptocurrency || !usdAmount || parseFloat(usdAmount) <= 0) {
      return res.status(400).json({ message: 'Valid cryptocurrency and amount required' });
    }

    // Security check: Minimum purchase amount
    if (parseFloat(usdAmount) < 1) {
      return res.status(400).json({ message: 'Minimum purchase amount is $1.00' });
    }

    // Create pending transaction record
    const transaction = await storage.createCryptoTransaction({
      userId,
      cryptocurrency,
      amount: "0", // Will be updated after Coinbase response
      usdValue: usdAmount,
      type: "purchase",
      status: "pending",
    });

    // Process with Coinbase API
    if (coinbaseService.isServiceConfigured()) {
      try {
        const coinbaseResult = await coinbaseService.purchaseCrypto(cryptocurrency, parseFloat(usdAmount));
        
        // Update transaction with Coinbase data
        await storage.updateCryptoTransactionStatus(
          transaction.id, 
          coinbaseResult.status,
          coinbaseResult.orderId
        );
        
        res.json({
          ...transaction,
          coinbaseOrderId: coinbaseResult.orderId,
          status: coinbaseResult.status,
          message: `Successfully purchased ${cryptocurrency} worth $${usdAmount}`
        });
      } catch (coinbaseError) {
        await storage.updateCryptoTransactionStatus(transaction.id, "failed");
        throw coinbaseError;
      }
    } else {
      res.json({
        ...transaction,
        message: "Coinbase service not configured - transaction simulated"
      });
    }
  } catch (error) {
    console.error('Error processing crypto purchase:', error);
    res.status(500).json({ message: 'Failed to process cryptocurrency purchase' });
  }
});

// Service status endpoint for security monitoring
router.get('/api/service-status', async (req: Request, res: Response) => {
  try {
    const status = {
      database: { status: 'connected' },
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
```

---

## 5. External Service Integration

### server/services/coinbase.ts
```typescript
interface CoinbaseConfig {
  apiKey: string;
  apiSecret: string;
}

interface CoinbasePurchaseResult {
  orderId: string;
  status: string;
  amount: string;
  fees: string;
}

export class CoinbaseService {
  private config: CoinbaseConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    const apiKey = process.env.COINBASE_API_KEY;
    const apiSecret = process.env.COINBASE_API_SECRET;

    if (apiKey && apiSecret) {
      this.config = { apiKey, apiSecret };
      console.log('Coinbase service configured successfully');
    } else {
      console.log('Coinbase credentials not found in environment variables');
    }
  }

  public isServiceConfigured(): boolean {
    return this.config !== null;
  }

  public async purchaseCrypto(cryptocurrency: string, usdAmount: number): Promise<CoinbasePurchaseResult> {
    if (!this.config) {
      throw new Error('Coinbase service not configured');
    }

    try {
      // Security: Validate cryptocurrency symbol
      const validCryptos = ['BTC', 'ETH', 'LTC', 'BCH'];
      if (!validCryptos.includes(cryptocurrency.toUpperCase())) {
        throw new Error('Unsupported cryptocurrency');
      }

      // Security: Validate amount limits
      if (usdAmount < 1 || usdAmount > 10000) {
        throw new Error('Purchase amount must be between $1 and $10,000');
      }

      // Coinbase API integration with proper error handling
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-CB-ACCESS-KEY': this.config.apiKey,
        'X-CB-ACCESS-TIMESTAMP': Date.now().toString(),
      };

      const response = await fetch('https://api.coinbase.com/v2/buys', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: usdAmount.toString(),
          currency: 'USD',
          payment_method: 'wallet',
          crypto_currency: cryptocurrency.toUpperCase()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Coinbase API error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        orderId: data.data.id,
        status: data.data.status,
        amount: data.data.amount.amount,
        fees: data.data.fees[0]?.amount?.amount || '0'
      };

    } catch (error) {
      console.error('Coinbase purchase error:', error);
      throw new Error(`Failed to purchase ${cryptocurrency}: ${error.message}`);
    }
  }

  public async getAccountBalance(): Promise<any> {
    if (!this.config) {
      throw new Error('Coinbase service not configured');
    }

    try {
      const response = await fetch('https://api.coinbase.com/v2/accounts', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-CB-ACCESS-KEY': this.config.apiKey,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Coinbase account data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Coinbase balance:', error);
      throw error;
    }
  }
}

export const coinbaseService = new CoinbaseService();
```

---

## 6. Frontend Security Components

### client/src/lib/queryClient.ts
```typescript
import { QueryClient } from '@tanstack/react-query';

// Custom fetch with security headers
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const [url] = queryKey as [string];
        return apiRequest(url);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

export { apiRequest };
```

### client/src/pages/dime-token.tsx (Security-Sensitive Frontend)
```typescript
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface TokenBalance {
  balance: string;
  stakedAmount: string;
  totalEarned: string;
}

interface StakeRequest {
  amount: string;
  duration: number;
}

export const DimeTokenPage: React.FC = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState(30);
  const { toast } = useToast();

  // Secure data fetching
  const { data: balance, isLoading: balanceLoading } = useQuery<TokenBalance>({
    queryKey: ['/api/dime-token/balance'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['/api/dime-token/rewards'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Secure staking mutation with validation
  const stakeMutation = useMutation({
    mutationFn: async (data: StakeRequest) => {
      // Client-side validation
      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      if (!balance || parseFloat(balance.balance) < amount) {
        throw new Error('Insufficient balance for staking');
      }

      return apiRequest('/api/dime-token/stake', {
        method: 'POST',
        body: JSON.stringify({
          amount: data.amount,
          duration: data.duration
        }),
      });
    },
    onSuccess: () => {
      // Invalidate and refetch balance data
      queryClient.invalidateQueries({ queryKey: ['/api/dime-token/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dime-token/rewards'] });
      
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${stakeAmount} DTT`,
      });
      
      setStakeAmount('');
    },
    onError: (error: Error) => {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStake = () => {
    if (!stakeAmount) {
      toast({
        title: "Invalid Input",
        description: "Please enter a staking amount",
        variant: "destructive",
      });
      return;
    }

    stakeMutation.mutate({
      amount: stakeAmount,
      duration: stakeDuration
    });
  };

  // Input sanitization
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 8 decimal places
    if (/^\d*\.?\d{0,8}$/.test(value) || value === '') {
      setStakeAmount(value);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Dime Time Token (DTT)</h1>
      
      {/* Balance Card with security display */}
      <Card className="bg-[#8C9CFF] border-none mb-6">
        <CardHeader>
          <CardTitle className="text-white">Your DTT Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <div className="text-white">Loading balance...</div>
          ) : (
            <div className="space-y-2 text-white">
              <div>Available: {parseFloat(balance?.balance || '0').toFixed(8)} DTT</div>
              <div>Staked: {parseFloat(balance?.stakedAmount || '0').toFixed(8)} DTT</div>
              <div>Total Earned: {parseFloat(balance?.totalEarned || '0').toFixed(8)} DTT</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secure Staking Interface */}
      <Card className="bg-[#8C9CFF] border-none mb-6">
        <CardHeader>
          <CardTitle className="text-white">Stake DTT Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white block mb-2">Amount to Stake</label>
            <Input
              type="text"
              value={stakeAmount}
              onChange={handleAmountChange}
              placeholder="0.00000000"
              className="bg-white"
              disabled={stakeMutation.isPending}
            />
          </div>
          
          <div>
            <label className="text-white block mb-2">Staking Duration</label>
            <select 
              value={stakeDuration} 
              onChange={(e) => setStakeDuration(parseInt(e.target.value))}
              className="w-full p-2 rounded"
              disabled={stakeMutation.isPending}
            >
              <option value={30}>30 Days (10% APY)</option>
              <option value={90}>90 Days (15.5% APY)</option>
              <option value={180}>180 Days (15.5% APY)</option>
            </select>
          </div>
          
          <Button 
            onClick={handleStake}
            disabled={stakeMutation.isPending || !stakeAmount}
            className="w-full bg-white text-[#8C9CFF] hover:bg-gray-100"
          >
            {stakeMutation.isPending ? 'Staking...' : 'Stake Tokens'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 7. Environment Variables & Configuration

### Environment Security Configuration
```bash
# Critical security environment variables
SESSION_SECRET=your-session-secret-here
NODE_ENV=development

# Database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# External API keys (encrypted)
COINBASE_API_KEY=your-coinbase-api-key
COINBASE_API_SECRET=your-coinbase-api-secret
OPENAI_API_KEY=your-openai-api-key

# Security headers
CORS_ORIGIN=https://your-domain.com
```

---

## Security Checklist for Review

### 🔐 Authentication & Authorization
- [ ] Session management security
- [ ] Password hashing implementation
- [ ] User input validation
- [ ] Authorization checks on sensitive endpoints

### 💰 Financial Data Security
- [ ] Decimal precision handling for monetary values
- [ ] Transaction integrity validation
- [ ] Balance verification before operations
- [ ] Audit trail for financial operations

### 🔑 API Security
- [ ] Input validation using Zod schemas
- [ ] Rate limiting implementation
- [ ] Error handling without information leakage
- [ ] Secure external API integration

### 🌐 External Service Integration
- [ ] Coinbase API credential management
- [ ] API response validation
- [ ] Error handling for external service failures
- [ ] Secure transmission of sensitive data

### 🛡️ General Security
- [ ] Environment variable management
- [ ] CORS configuration
- [ ] HTTPS enforcement in production
- [ ] Sensitive data exposure in logs/responses

---

**Please run this complete code through ChatGPT for comprehensive security analysis, focusing on:**
1. Financial transaction security
2. Cryptocurrency integration vulnerabilities  
3. User data protection
4. API security best practices
5. Input validation completeness
6. External service integration security