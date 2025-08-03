import { type User, type InsertUser, type Debt, type InsertDebt, type Transaction, type InsertTransaction, type Payment, type InsertPayment, type RoundUpSettings, type InsertRoundUpSettings } from "@shared/schema";
import { randomUUID } from "crypto";

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

  // Round-up settings methods
  getRoundUpSettings(userId: string): Promise<RoundUpSettings | undefined>;
  createOrUpdateRoundUpSettings(settings: InsertRoundUpSettings): Promise<RoundUpSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private debts: Map<string, Debt>;
  private transactions: Map<string, Transaction>;
  private payments: Map<string, Payment>;
  private roundUpSettings: Map<string, RoundUpSettings>;

  constructor() {
    this.users = new Map();
    this.debts = new Map();
    this.transactions = new Map();
    this.payments = new Map();
    this.roundUpSettings = new Map();
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user-1",
      username: "sarah.demo",
      password: "hashedpassword",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
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
        currentBalance: "8247.12",
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
        currentBalance: "12400.00",
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
        currentBalance: "3200.00",
        interestRate: "4.50",
        minimumPayment: "89.00",
        dueDate: 1,
        isActive: true,
        createdAt: new Date("2024-01-01"),
      },
    ];
    demoDebts.forEach(debt => this.debts.set(debt.id, debt));

    // Create demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: "trans-1",
        userId: demoUser.id,
        merchant: "Starbucks Coffee",
        category: "Food & Drink",
        amount: "4.67",
        roundUpAmount: "0.33",
        date: new Date(),
        description: "Morning coffee",
      },
      {
        id: "trans-2",
        userId: demoUser.id,
        merchant: "Shell Gas Station",
        category: "Transportation",
        amount: "37.42",
        roundUpAmount: "0.58",
        date: new Date(Date.now() - 86400000), // Yesterday
        description: "Gas fill-up",
      },
      {
        id: "trans-3",
        userId: demoUser.id,
        merchant: "Amazon Purchase",
        category: "Shopping",
        amount: "24.99",
        roundUpAmount: "0.01",
        date: new Date(Date.now() - 86400000),
        description: "Online purchase",
      },
      {
        id: "trans-4",
        userId: demoUser.id,
        merchant: "Whole Foods Market",
        category: "Groceries",
        amount: "67.31",
        roundUpAmount: "0.69",
        date: new Date(Date.now() - 172800000), // 2 days ago
        description: "Weekly groceries",
      },
    ];
    demoTransactions.forEach(trans => this.transactions.set(trans.id, trans));

    // Create demo round-up settings
    const demoRoundUpSettings: RoundUpSettings = {
      id: "settings-1",
      userId: demoUser.id,
      isEnabled: true,
      multiplier: "1.00",
      autoApplyThreshold: "25.00",
    };
    this.roundUpSettings.set(demoUser.id, demoRoundUpSettings);
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
      const newSettings: RoundUpSettings = { ...settings, id };
      this.roundUpSettings.set(settings.userId, newSettings);
      return newSettings;
    }
  }
}

export const storage = new MemStorage();
