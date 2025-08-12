import { 
  type User, 
  type InsertUser, 
  type Debt, 
  type InsertDebt, 
  type Transaction, 
  type InsertTransaction, 
  type Payment, 
  type InsertPayment, 
  type RoundUpSettings, 
  type InsertRoundUpSettings, 
  type CryptoPurchase, 
  type InsertCryptoPurchase, 
  type BankAccount, 
  type InsertBankAccount, 
  type UserSession, 
  type InsertUserSession,
  users, 
  debts, 
  transactions, 
  payments, 
  roundUpSettings, 
  cryptoPurchases, 
  bankAccounts, 
  userSessions
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Debt methods
  getDebtsByUserId(userId: string): Promise<Debt[]>;
  getDebt(id: string): Promise<Debt | undefined>;
  createDebt(debt: InsertDebt): Promise<Debt>;
  updateDebt(id: string, updates: Partial<Debt>): Promise<Debt | undefined>;

  // Transaction methods
  getTransactionsByUserId(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Payment methods
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  getPaymentsByDebtId(debtId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  makeAcceleratedPayment(userId: string, debtId: string, amount: string): Promise<{ payment: Payment; updatedDebt: Debt }>;

  // Round-up settings methods
  getRoundUpSettings(userId: string): Promise<RoundUpSettings | undefined>;
  createOrUpdateRoundUpSettings(settings: InsertRoundUpSettings): Promise<RoundUpSettings>;

  // Crypto purchase methods
  getCryptoPurchasesByUserId(userId: string): Promise<CryptoPurchase[]>;
  createCryptoPurchase(purchase: InsertCryptoPurchase): Promise<CryptoPurchase>;
  updateCryptoPurchaseStatus(id: string, status: string, coinbaseOrderId?: string): Promise<CryptoPurchase | undefined>;

  // Bank account methods
  getBankAccountsByUserId(userId: string): Promise<BankAccount[]>;
  createBankAccount(account: InsertBankAccount): Promise<BankAccount>;
  getBankAccountByPlaidItemId(itemId: string): Promise<BankAccount | undefined>;
  updateBankAccountStatus(id: string, isActive: boolean): Promise<BankAccount | undefined>;

  // User session methods
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSessionByToken(token: string): Promise<UserSession | undefined>;
  updateSessionActivity(id: string): Promise<UserSession | undefined>;
  deactivateUserSessions(userId: string, deviceType?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private debts: Map<string, Debt>;
  private transactions: Map<string, Transaction>;
  private payments: Map<string, Payment>;
  private roundUpSettings: Map<string, RoundUpSettings>;
  private cryptoPurchases: Map<string, CryptoPurchase>;
  private bankAccounts: Map<string, BankAccount>;
  private userSessions: Map<string, UserSession>;

  constructor() {
    this.users = new Map();
    this.debts = new Map();
    this.transactions = new Map();
    this.payments = new Map();
    this.roundUpSettings = new Map();
    this.cryptoPurchases = new Map();
    this.bankAccounts = new Map();
    this.userSessions = new Map();
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user-1",
      username: "anna.demo",
      password: "hashedpassword",
      firstName: "Anna",
      lastName: "Johnson",
      email: "anna@example.com",
      createdAt: new Date("2024-01-01"),
    };
    this.users.set(demoUser.id, demoUser);

    // Create demo debts
    const demoDebts: Debt[] = [
      {
        id: "debt-1",
        userId: demoUser.id,
        name: "Chase Freedom Card",
        accountNumber: "••••4892",
        originalBalance: "15000.00",
        currentBalance: "6847.12",
        interestRate: "18.99",
        minimumPayment: "165.00",
        dueDate: 15,
        isActive: true,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "debt-2",
        userId: demoUser.id,
        name: "Capital One Venture",
        accountNumber: "••••2847",
        originalBalance: "20000.00",
        currentBalance: "10200.00",
        interestRate: "21.99",
        minimumPayment: "248.00",
        dueDate: 22,
        isActive: true,
        createdAt: new Date("2024-01-01"),
      },
      {
        id: "debt-3",
        userId: demoUser.id,
        name: "Student Loan",
        accountNumber: "Federal Direct",
        originalBalance: "8000.00",
        currentBalance: "1850.00",
        interestRate: "4.50",
        minimumPayment: "89.00",
        dueDate: 1,
        isActive: true,
        createdAt: new Date("2024-01-01"),
      },
    ];
    demoDebts.forEach(debt => this.debts.set(debt.id, debt));

    // Create demo transactions with higher round-ups
    const demoTransactions: Transaction[] = [
      {
        id: "trans-1",
        userId: demoUser.id,
        merchant: "Starbucks Coffee",
        category: "Food & Drink",
        amount: "4.17",
        roundUpAmount: "0.83",
        date: new Date(),
        description: "Morning coffee",
      },
      {
        id: "trans-2",
        userId: demoUser.id,
        merchant: "Shell Gas Station",
        category: "Transportation",
        amount: "37.28",
        roundUpAmount: "0.72",
        date: new Date(Date.now() - 86400000), // Yesterday
        description: "Gas fill-up",
      },
      {
        id: "trans-3",
        userId: demoUser.id,
        merchant: "Amazon Purchase",
        category: "Shopping",
        amount: "24.15",
        roundUpAmount: "0.85",
        date: new Date(Date.now() - 86400000),
        description: "Online purchase",
      },
      {
        id: "trans-4",
        userId: demoUser.id,
        merchant: "Whole Foods Market",
        category: "Groceries",
        amount: "67.22",
        roundUpAmount: "0.78",
        date: new Date(Date.now() - 172800000), // 2 days ago
        description: "Weekly groceries",
      },
      {
        id: "trans-5",
        userId: demoUser.id,
        merchant: "Target",
        category: "Shopping",
        amount: "86.11",
        roundUpAmount: "0.89",
        date: new Date(Date.now() - 259200000), // 3 days ago
        description: "Home supplies",
      },
      {
        id: "trans-6",
        userId: demoUser.id,
        merchant: "McDonald's",
        category: "Food & Drink",
        amount: "12.08",
        roundUpAmount: "0.92",
        date: new Date(Date.now() - 345600000), // 4 days ago
        description: "Lunch",
      },
      {
        id: "trans-7",
        userId: demoUser.id,
        merchant: "CVS Pharmacy",
        category: "Health",
        amount: "28.13",
        roundUpAmount: "0.87",
        date: new Date(Date.now() - 432000000), // 5 days ago
        description: "Prescriptions",
      },
      {
        id: "trans-8",
        userId: demoUser.id,
        merchant: "Uber",
        category: "Transportation",
        amount: "19.07",
        roundUpAmount: "0.93",
        date: new Date(Date.now() - 518400000), // 6 days ago
        description: "Ride to airport",
      },
      {
        id: "trans-9",
        userId: demoUser.id,
        merchant: "Best Buy",
        category: "Electronics",
        amount: "145.12",
        roundUpAmount: "0.88",
        date: new Date(Date.now() - 604800000), // 1 week ago
        description: "Phone charger",
      },
      {
        id: "trans-10",
        userId: demoUser.id,
        merchant: "Chipotle",
        category: "Food & Drink",
        amount: "13.09",
        roundUpAmount: "0.91",
        date: new Date(Date.now() - 691200000), // 8 days ago
        description: "Dinner",
      },
      {
        id: "trans-11",
        userId: demoUser.id,
        merchant: "Home Depot",
        category: "Home Improvement",
        amount: "92.06",
        roundUpAmount: "0.94",
        date: new Date(Date.now() - 777600000), // 9 days ago
        description: "Garden supplies",
      },
      {
        id: "trans-12",
        userId: demoUser.id,
        merchant: "Netflix",
        category: "Entertainment",
        amount: "15.03",
        roundUpAmount: "0.97",
        date: new Date(Date.now() - 864000000), // 10 days ago
        description: "Monthly subscription",
      },
      {
        id: "trans-13",
        userId: demoUser.id,
        merchant: "Costco",
        category: "Groceries",
        amount: "124.08",
        roundUpAmount: "0.92",
        date: new Date(Date.now() - 950400000), // 11 days ago
        description: "Bulk shopping",
      },
      {
        id: "trans-14",
        userId: demoUser.id,
        merchant: "Spotify",
        category: "Entertainment",
        amount: "9.99",
        roundUpAmount: "0.01",
        date: new Date(Date.now() - 1036800000), // 12 days ago
        description: "Music streaming",
      },
      {
        id: "trans-15",
        userId: demoUser.id,
        merchant: "Panera Bread",
        category: "Food & Drink",
        amount: "8.23",
        roundUpAmount: "0.77",
        date: new Date(Date.now() - 1123200000), // 13 days ago
        description: "Lunch meeting",
      },
      {
        id: "trans-16",
        userId: demoUser.id,
        merchant: "Gas Station",
        category: "Transportation",
        amount: "42.16",
        roundUpAmount: "0.84",
        date: new Date(Date.now() - 1209600000), // 14 days ago
        description: "Fuel up",
      },
      {
        id: "trans-17",
        userId: demoUser.id,
        merchant: "Walgreens",
        category: "Health",
        amount: "17.34",
        roundUpAmount: "0.66",
        date: new Date(Date.now() - 1296000000), // 15 days ago
        description: "Vitamins",
      },
      {
        id: "trans-18",
        userId: demoUser.id,
        merchant: "Pizza Hut",
        category: "Food & Drink",
        amount: "23.12",
        roundUpAmount: "0.88",
        date: new Date(Date.now() - 1382400000), // 16 days ago
        description: "Friday dinner",
      },
      {
        id: "trans-19",
        userId: demoUser.id,
        merchant: "Barnes & Noble",
        category: "Books",
        amount: "34.07",
        roundUpAmount: "0.93",
        date: new Date(Date.now() - 1468800000), // 17 days ago
        description: "Book purchase",
      },
      {
        id: "trans-20",
        userId: demoUser.id,
        merchant: "Trader Joe's",
        category: "Groceries",
        amount: "56.14",
        roundUpAmount: "0.86",
        date: new Date(Date.now() - 1555200000), // 18 days ago
        description: "Weekly groceries",
      },
    ];
    demoTransactions.forEach(trans => this.transactions.set(trans.id, trans));

    // Create demo round-up settings with crypto enabled
    const demoRoundUpSettings: RoundUpSettings = {
      id: "settings-1",
      userId: demoUser.id,
      isEnabled: true,
      multiplier: "1.00",
      autoApplyThreshold: "25.00",
      cryptoEnabled: true,
      cryptoPercentage: "25.00", // 25% of round-ups go to crypto
      preferredCrypto: "BTC",
    };
    this.roundUpSettings.set(demoUser.id, demoRoundUpSettings);

    // Create demo crypto purchases
    const demoCryptoPurchases: CryptoPurchase[] = [
      {
        id: "crypto-1",
        userId: demoUser.id,
        transactionId: "trans-1",
        cryptoSymbol: "BTC",
        amountUsd: "0.08", // 25% of $0.33 round-up
        cryptoAmount: "0.00000086",
        purchasePrice: "93000.00",
        coinbaseOrderId: "order-btc-001",
        status: "completed",
        createdAt: new Date(),
      },
      {
        id: "crypto-2",
        userId: demoUser.id,
        transactionId: "trans-2",
        cryptoSymbol: "BTC",
        amountUsd: "0.15", // 25% of $0.58 round-up
        cryptoAmount: "0.00000161",
        purchasePrice: "93200.00",
        coinbaseOrderId: "order-btc-002",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "crypto-3",
        userId: demoUser.id,
        transactionId: "trans-4",
        cryptoSymbol: "BTC",
        amountUsd: "0.17", // 25% of $0.69 round-up
        cryptoAmount: "0.00000182",
        purchasePrice: "93500.00",
        coinbaseOrderId: "order-btc-003",
        status: "completed",
        createdAt: new Date(Date.now() - 172800000),
      }
    ];
    demoCryptoPurchases.forEach(purchase => this.cryptoPurchases.set(purchase.id, purchase));

    // Create demo payment history to show significant debt paydown
    const demoPayments: Payment[] = [
      {
        id: "payment-1",
        userId: demoUser.id,
        debtId: "debt-1",
        amount: "2500.00",
        source: "manual",
        date: new Date(Date.now() - 2592000000), // 30 days ago
        status: "completed",
      },
      {
        id: "payment-2",
        userId: demoUser.id,
        debtId: "debt-2",
        amount: "3200.00",
        source: "manual",
        date: new Date(Date.now() - 2160000000), // 25 days ago
        status: "completed",
      },
      {
        id: "payment-3",
        userId: demoUser.id,
        debtId: "debt-3",
        amount: "1800.00",
        source: "manual",
        date: new Date(Date.now() - 1728000000), // 20 days ago
        status: "completed",
      },
      {
        id: "payment-4",
        userId: demoUser.id,
        debtId: "debt-1",
        amount: "3405.88",
        source: "round_up",
        date: new Date(Date.now() - 1296000000), // 15 days ago
        status: "completed",
      },
      {
        id: "payment-5",
        userId: demoUser.id,
        debtId: "debt-2",
        amount: "6597.00",
        source: "round_up",
        date: new Date(Date.now() - 864000000), // 10 days ago
        status: "completed",
      },
      {
        id: "payment-6",
        userId: demoUser.id,
        debtId: "debt-3",
        amount: "4350.00",
        source: "round_up",
        date: new Date(Date.now() - 432000000), // 5 days ago
        status: "completed",
      },
    ];
    demoPayments.forEach(payment => this.payments.set(payment.id, payment));
  }

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

  async getDebtsByUserId(userId: string): Promise<Debt[]> {
    return Array.from(this.debts.values()).filter(debt => debt.userId === userId && debt.isActive);
  }

  async getDebt(id: string): Promise<Debt | undefined> {
    return this.debts.get(id);
  }

  async createDebt(insertDebt: InsertDebt): Promise<Debt> {
    const id = randomUUID();
    const debt: Debt = { 
      ...insertDebt, 
      id,
      isActive: insertDebt.isActive ?? true,
      createdAt: new Date(),
    };
    this.debts.set(id, debt);
    return debt;
  }

  async updateDebt(id: string, updates: Partial<Debt>): Promise<Debt | undefined> {
    const debt = this.debts.get(id);
    if (!debt) return undefined;
    
    const updatedDebt = { ...debt, ...updates };
    this.debts.set(id, updatedDebt);
    return updatedDebt;
  }

  async getTransactionsByUserId(userId: string, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter(trans => trans.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      description: insertTransaction.description ?? null,
      date: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getPaymentsByDebtId(debtId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.debtId === debtId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      ...insertPayment, 
      id,
      date: new Date(),
      status: 'completed',
    };
    this.payments.set(id, payment);
    return payment;
  }

  async makeAcceleratedPayment(userId: string, debtId: string, amount: string): Promise<{ payment: Payment; updatedDebt: Debt }> {
    const debt = this.debts.get(debtId);
    if (!debt || debt.userId !== userId) {
      throw new Error('Debt not found or unauthorized');
    }

    // Create the payment record
    const payment = await this.createPayment({
      userId,
      debtId,
      amount,
      source: 'manual',
    });

    // Update the debt balance
    const currentBalance = parseFloat(debt.currentBalance);
    const paymentAmount = parseFloat(amount);
    const newBalance = Math.max(0, currentBalance - paymentAmount);

    const updatedDebt = await this.updateDebt(debtId, {
      currentBalance: newBalance.toFixed(2),
    });

    if (!updatedDebt) {
      throw new Error('Failed to update debt balance');
    }

    return { payment, updatedDebt };
  }

  async getRoundUpSettings(userId: string): Promise<RoundUpSettings | undefined> {
    return this.roundUpSettings.get(userId);
  }

  async createOrUpdateRoundUpSettings(settings: InsertRoundUpSettings): Promise<RoundUpSettings> {
    const existing = this.roundUpSettings.get(settings.userId);
    
    if (existing) {
      const updated = { ...existing, ...settings };
      this.roundUpSettings.set(settings.userId, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newSettings: RoundUpSettings = { 
        ...settings, 
        id,
        isEnabled: settings.isEnabled ?? true,
        multiplier: settings.multiplier ?? "1.00",
        autoApplyThreshold: settings.autoApplyThreshold ?? "25.00",
        cryptoEnabled: settings.cryptoEnabled ?? false,
        cryptoPercentage: settings.cryptoPercentage ?? "0.00",
        preferredCrypto: settings.preferredCrypto ?? "BTC",
      };
      this.roundUpSettings.set(settings.userId, newSettings);
      return newSettings;
    }
  }

  async getCryptoPurchasesByUserId(userId: string): Promise<CryptoPurchase[]> {
    return Array.from(this.cryptoPurchases.values())
      .filter(purchase => purchase.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createCryptoPurchase(insertPurchase: InsertCryptoPurchase): Promise<CryptoPurchase> {
    const id = randomUUID();
    const purchase: CryptoPurchase = {
      ...insertPurchase,
      id,
      transactionId: insertPurchase.transactionId ?? null,
      coinbaseOrderId: insertPurchase.coinbaseOrderId ?? null,
      status: 'pending',
      createdAt: new Date(),
    };
    this.cryptoPurchases.set(id, purchase);
    return purchase;
  }

  async updateCryptoPurchaseStatus(id: string, status: string, coinbaseOrderId?: string): Promise<CryptoPurchase | undefined> {
    const purchase = this.cryptoPurchases.get(id);
    if (!purchase) return undefined;
    
    const updated: CryptoPurchase = {
      ...purchase,
      status,
      coinbaseOrderId: coinbaseOrderId || purchase.coinbaseOrderId,
    };
    this.cryptoPurchases.set(id, updated);
    return updated;
  }

  async getBankAccountsByUserId(userId: string): Promise<BankAccount[]> {
    return Array.from(this.bankAccounts.values())
      .filter(account => account.userId === userId && account.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> {
    const id = randomUUID();
    const bankAccount: BankAccount = {
      ...account,
      id,
      mask: account.mask ?? null,
      isActive: account.isActive ?? true,
      createdAt: new Date(),
    };
    this.bankAccounts.set(id, bankAccount);
    return bankAccount;
  }

  async getBankAccountByPlaidItemId(itemId: string): Promise<BankAccount | undefined> {
    return Array.from(this.bankAccounts.values()).find(account => account.plaidItemId === itemId);
  }

  async updateBankAccountStatus(id: string, isActive: boolean): Promise<BankAccount | undefined> {
    const account = this.bankAccounts.get(id);
    if (!account) return undefined;
    
    const updated = { ...account, isActive };
    this.bankAccounts.set(id, updated);
    return updated;
  }

  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const id = randomUUID();
    const userSession: UserSession = {
      ...session,
      id,
      deviceId: session.deviceId ?? null,
      isActive: session.isActive ?? true,
      lastActivity: new Date(),
      createdAt: new Date(),
    };
    this.userSessions.set(id, userSession);
    return userSession;
  }

  async getUserSessionByToken(token: string): Promise<UserSession | undefined> {
    return Array.from(this.userSessions.values()).find(session => session.sessionToken === token);
  }

  async updateSessionActivity(id: string): Promise<UserSession | undefined> {
    const session = this.userSessions.get(id);
    if (!session) return undefined;
    
    const updated = { ...session, lastActivity: new Date() };
    this.userSessions.set(id, updated);
    return updated;
  }

  async deactivateUserSessions(userId: string, deviceType?: string): Promise<void> {
    Array.from(this.userSessions.entries()).forEach(([id, session]) => {
      if (session.userId === userId && (!deviceType || session.deviceType === deviceType)) {
        const updated = { ...session, isActive: false };
        this.userSessions.set(id, updated);
      }
    });
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getDebtsByUserId(userId: string): Promise<Debt[]> {
    return await db.select().from(debts).where(eq(debts.userId, userId));
  }

  async getDebt(id: string): Promise<Debt | undefined> {
    const [debt] = await db.select().from(debts).where(eq(debts.id, id));
    return debt || undefined;
  }

  async createDebt(insertDebt: InsertDebt): Promise<Debt> {
    const [debt] = await db
      .insert(debts)
      .values(insertDebt)
      .returning();
    return debt;
  }

  async updateDebt(id: string, updates: Partial<Debt>): Promise<Debt | undefined> {
    const [debt] = await db
      .update(debts)
      .set(updates)
      .where(eq(debts.id, id))
      .returning();
    return debt || undefined;
  }

  async getTransactionsByUserId(userId: string, limit?: number): Promise<Transaction[]> {
    const query = db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
    
    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await db.select().from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.date));
  }

  async getPaymentsByDebtId(debtId: string): Promise<Payment[]> {
    return await db.select().from(payments)
      .where(eq(payments.debtId, debtId))
      .orderBy(desc(payments.date));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async makeAcceleratedPayment(userId: string, debtId: string, amount: string): Promise<{ payment: Payment; updatedDebt: Debt }> {
    const debt = await this.getDebt(debtId);
    if (!debt || debt.userId !== userId) {
      throw new Error('Debt not found or unauthorized');
    }

    // Create the payment record
    const payment = await this.createPayment({
      userId,
      debtId,
      amount,
      source: 'manual',
    });

    // Update the debt balance
    const currentBalance = parseFloat(debt.currentBalance);
    const paymentAmount = parseFloat(amount);
    const newBalance = Math.max(0, currentBalance - paymentAmount);

    const updatedDebt = await this.updateDebt(debtId, {
      currentBalance: newBalance.toFixed(2),
    });

    if (!updatedDebt) {
      throw new Error('Failed to update debt balance');
    }

    return { payment, updatedDebt };
  }

  async getRoundUpSettings(userId: string): Promise<RoundUpSettings | undefined> {
    const [settings] = await db.select().from(roundUpSettings).where(eq(roundUpSettings.userId, userId));
    return settings || undefined;
  }

  async createOrUpdateRoundUpSettings(settings: InsertRoundUpSettings): Promise<RoundUpSettings> {
    const existing = await this.getRoundUpSettings(settings.userId);
    
    if (existing) {
      const [updated] = await db
        .update(roundUpSettings)
        .set(settings)
        .where(eq(roundUpSettings.userId, settings.userId))
        .returning();
      return updated;
    } else {
      const [newSettings] = await db
        .insert(roundUpSettings)
        .values(settings)
        .returning();
      return newSettings;
    }
  }

  async getCryptoPurchasesByUserId(userId: string): Promise<CryptoPurchase[]> {
    return await db.select().from(cryptoPurchases)
      .where(eq(cryptoPurchases.userId, userId))
      .orderBy(desc(cryptoPurchases.createdAt));
  }

  async createCryptoPurchase(insertPurchase: InsertCryptoPurchase): Promise<CryptoPurchase> {
    const [purchase] = await db
      .insert(cryptoPurchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async updateCryptoPurchaseStatus(id: string, status: string, coinbaseOrderId?: string): Promise<CryptoPurchase | undefined> {
    const updateData: any = { status };
    if (coinbaseOrderId) {
      updateData.coinbaseOrderId = coinbaseOrderId;
    }
    
    const [updated] = await db
      .update(cryptoPurchases)
      .set(updateData)
      .where(eq(cryptoPurchases.id, id))
      .returning();
    return updated || undefined;
  }

  async getBankAccountsByUserId(userId: string): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts)
      .where(eq(bankAccounts.userId, userId))
      .orderBy(desc(bankAccounts.createdAt));
  }

  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> {
    const [bankAccount] = await db
      .insert(bankAccounts)
      .values(account)
      .returning();
    return bankAccount;
  }

  async getBankAccountByPlaidItemId(itemId: string): Promise<BankAccount | undefined> {
    const [account] = await db.select().from(bankAccounts)
      .where(eq(bankAccounts.plaidItemId, itemId));
    return account || undefined;
  }

  async updateBankAccountStatus(id: string, isActive: boolean): Promise<BankAccount | undefined> {
    const [updated] = await db
      .update(bankAccounts)
      .set({ isActive })
      .where(eq(bankAccounts.id, id))
      .returning();
    return updated || undefined;
  }

  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const [userSession] = await db
      .insert(userSessions)
      .values(session)
      .returning();
    return userSession;
  }

  async getUserSessionByToken(token: string): Promise<UserSession | undefined> {
    const [session] = await db.select().from(userSessions)
      .where(eq(userSessions.sessionToken, token));
    return session || undefined;
  }

  async updateSessionActivity(id: string): Promise<UserSession | undefined> {
    const [updated] = await db
      .update(userSessions)
      .set({ lastActivity: new Date() })
      .where(eq(userSessions.id, id))
      .returning();
    return updated || undefined;
  }

  async deactivateUserSessions(userId: string, deviceType?: string): Promise<void> {
    if (deviceType) {
      await db.update(userSessions)
        .set({ isActive: false })
        .where(and(eq(userSessions.userId, userId), eq(userSessions.deviceType, deviceType)));
    } else {
      await db.update(userSessions)
        .set({ isActive: false })
        .where(eq(userSessions.userId, userId));
    }
  }
}

export const storage = new MemStorage();
