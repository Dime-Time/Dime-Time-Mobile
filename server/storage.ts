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
  type Notification,
  type InsertNotification,
  type NotificationSettings,
  type InsertNotificationSettings,
  type DttHoldings,
  type InsertDttHoldings,
  type DttRewards,
  type InsertDttRewards,
  type DttStaking,
  type InsertDttStaking,
  type DttTokenInfo,
  type InsertDttTokenInfo,
  users, 
  debts, 
  transactions, 
  payments, 
  roundUpSettings, 
  cryptoPurchases, 
  bankAccounts, 
  userSessions,
  notifications,
  notificationSettings,
  dttHoldings,
  dttRewards,
  dttStaking,
  dttTokenInfo
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

  // DTT Token methods
  getDttHoldings(userId: string): Promise<DttHoldings | undefined>;
  createOrUpdateDttHoldings(holdings: InsertDttHoldings): Promise<DttHoldings>;
  updateDttBalance(userId: string, balance: string, stakedAmount?: string, totalEarned?: string): Promise<DttHoldings | undefined>;
  
  getDttRewardsByUserId(userId: string): Promise<DttRewards[]>;
  createDttReward(reward: InsertDttRewards): Promise<DttRewards>;
  
  getDttStakingByUserId(userId: string): Promise<DttStaking[]>;
  createDttStaking(staking: InsertDttStaking): Promise<DttStaking>;
  updateDttStakingStatus(id: string, status: string): Promise<DttStaking | undefined>;
  
  getDttTokenInfo(): Promise<DttTokenInfo | undefined>;
  updateDttTokenInfo(info: InsertDttTokenInfo): Promise<DttTokenInfo>;
  getUserSessionByToken(token: string): Promise<UserSession | undefined>;
  updateSessionActivity(id: string): Promise<UserSession | undefined>;
  deactivateUserSessions(userId: string, deviceType?: string): Promise<void>;

  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: string, limit?: number): Promise<Notification[]>;
  updateNotificationStatus(id: string, status: string, sentAt?: Date, deliveredAt?: Date): Promise<Notification | undefined>;
  
  // Notification settings methods
  getNotificationSettings(userId: string): Promise<NotificationSettings | undefined>;
  createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
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
  private notifications: Map<string, Notification>;
  private notificationSettingsMap: Map<string, NotificationSettings>;
  private dttHoldingsMap: Map<string, DttHoldings>;
  private dttRewardsMap: Map<string, DttRewards>;
  private dttStakingMap: Map<string, DttStaking>;
  private dttTokenInfoData: DttTokenInfo | undefined;

  constructor() {
    this.users = new Map();
    this.debts = new Map();
    this.transactions = new Map();
    this.payments = new Map();
    this.roundUpSettings = new Map();
    this.cryptoPurchases = new Map();
    this.bankAccounts = new Map();
    this.userSessions = new Map();
    this.notifications = new Map();
    this.notificationSettingsMap = new Map();
    this.dttHoldingsMap = new Map();
    this.dttRewardsMap = new Map();
    this.dttStakingMap = new Map();
    
    // Initialize DTT token info
    this.dttTokenInfoData = {
      id: "dtt-info",
      currentPrice: "0.284700",
      priceChange24h: "12.45",
      marketCap: "28470000.00",
      volume24h: "2847000.00",
      totalSupply: "100000000",
      circulatingSupply: "75000000",
      lastUpdated: new Date(),
    };
    
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

    // Create demo crypto purchases totaling $12,800.88
    const demoCryptoPurchases: CryptoPurchase[] = [
      {
        id: "crypto-1",
        userId: demoUser.id,
        transactionId: "trans-1",
        cryptoSymbol: "BTC",
        amountUsd: "856.05",
        cryptoAmount: "0.00920592",
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
        amountUsd: "926.17",
        cryptoAmount: "0.00993718",
        purchasePrice: "93200.00",
        coinbaseOrderId: "order-btc-002",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "crypto-3",
        userId: demoUser.id,
        transactionId: "trans-3",
        cryptoSymbol: "BTC",
        amountUsd: "1158.10",
        cryptoAmount: "0.01241289",
        purchasePrice: "93300.00",
        coinbaseOrderId: "order-btc-003",
        status: "completed",
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        id: "crypto-4",
        userId: demoUser.id,
        transactionId: "trans-4",
        cryptoSymbol: "BTC",
        amountUsd: "785.46",
        purchasePrice: "93500.00",
        cryptoAmount: "0.00840171",
        coinbaseOrderId: "order-btc-004",
        status: "completed",
        createdAt: new Date(Date.now() - 259200000),
      },
      {
        id: "crypto-5",
        userId: demoUser.id,
        transactionId: "trans-5",
        cryptoSymbol: "BTC",
        amountUsd: "1108.09",
        cryptoAmount: "0.01184078",
        purchasePrice: "93600.00",
        coinbaseOrderId: "order-btc-005",
        status: "completed",
        createdAt: new Date(Date.now() - 345600000),
      },
      {
        id: "crypto-6",
        userId: demoUser.id,
        transactionId: "trans-6",
        cryptoSymbol: "BTC",
        amountUsd: "957.06",
        cryptoAmount: "0.01021929",
        purchasePrice: "93700.00",
        coinbaseOrderId: "order-btc-006",
        status: "completed",
        createdAt: new Date(Date.now() - 432000000),
      },
      {
        id: "crypto-7",
        userId: demoUser.id,
        transactionId: "trans-7",
        cryptoSymbol: "BTC",
        amountUsd: "1259.11",
        cryptoAmount: "0.01339267",
        purchasePrice: "94000.00",
        coinbaseOrderId: "order-btc-007",
        status: "completed",
        createdAt: new Date(Date.now() - 518400000),
      },
      {
        id: "crypto-8",
        userId: demoUser.id,
        transactionId: "trans-8",
        cryptoSymbol: "ETH",
        amountUsd: "725.26",
        cryptoAmount: "0.27062687",
        purchasePrice: "2680.00",
        coinbaseOrderId: "order-eth-001",
        status: "completed",
        createdAt: new Date(Date.now() - 604800000),
      },
      {
        id: "crypto-9",
        userId: demoUser.id,
        transactionId: "trans-9",
        cryptoSymbol: "ETH",
        amountUsd: "896.72",
        cryptoAmount: "0.33212593",
        purchasePrice: "2700.00",
        coinbaseOrderId: "order-eth-002",
        status: "completed",
        createdAt: new Date(Date.now() - 691200000),
      },
      {
        id: "crypto-10",
        userId: demoUser.id,
        transactionId: "trans-10",
        cryptoSymbol: "ETH",
        amountUsd: "655.05",
        cryptoAmount: "0.24078676",
        purchasePrice: "2720.00",
        coinbaseOrderId: "order-eth-003",
        status: "completed",
        createdAt: new Date(Date.now() - 777600000),
      },
      {
        id: "crypto-11",
        userId: demoUser.id,
        transactionId: "trans-11",
        cryptoSymbol: "ETH",
        amountUsd: "987.29",
        cryptoAmount: "0.36037664",
        purchasePrice: "2740.00",
        coinbaseOrderId: "order-eth-004",
        status: "completed",
        createdAt: new Date(Date.now() - 864000000),
      },
      {
        id: "crypto-12",
        userId: demoUser.id,
        transactionId: "trans-12",
        cryptoSymbol: "ETH",
        amountUsd: "765.67",
        cryptoAmount: "0.27741667",
        purchasePrice: "2760.00",
        coinbaseOrderId: "order-eth-005",
        status: "completed",
        createdAt: new Date(Date.now() - 950400000),
      },
      {
        id: "crypto-13",
        userId: demoUser.id,
        transactionId: "trans-13",
        cryptoSymbol: "XRP",
        amountUsd: "352.61",
        cryptoAmount: "141.04400000",
        purchasePrice: "2.50",
        coinbaseOrderId: "order-xrp-001",
        status: "completed",
        createdAt: new Date(Date.now() - 1036800000),
      },
      {
        id: "crypto-14",
        userId: demoUser.id,
        transactionId: "trans-14",
        cryptoSymbol: "XRP",
        amountUsd: "483.46",
        cryptoAmount: "189.59607843",
        purchasePrice: "2.55",
        coinbaseOrderId: "order-xrp-002",
        status: "completed",
        createdAt: new Date(Date.now() - 1123200000),
      },
      {
        id: "crypto-15",
        userId: demoUser.id,
        transactionId: "trans-15",
        cryptoSymbol: "XRP",
        amountUsd: "423.01",
        cryptoAmount: "162.69615385",
        purchasePrice: "2.60",
        coinbaseOrderId: "order-xrp-003",
        status: "completed",
        createdAt: new Date(Date.now() - 1209600000),
      },
      {
        id: "crypto-16",
        userId: demoUser.id,
        transactionId: "trans-16",
        cryptoSymbol: "XRP",
        amountUsd: "251.82",
        cryptoAmount: "95.02641509",
        purchasePrice: "2.65",
        coinbaseOrderId: "order-xrp-004",
        status: "completed",
        createdAt: new Date(Date.now() - 1296000000),
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

    // Create demo DTT holdings
    const demoDttHoldings: DttHoldings = {
      id: randomUUID(),
      userId: demoUser.id,
      balance: "247.85620000",
      stakedAmount: "125.00000000",
      totalEarned: "372.85620000",
      createdAt: new Date("2024-01-01"),
      lastActivity: new Date(),
    };
    this.dttHoldingsMap.set(demoUser.id, demoDttHoldings);

    // Create demo DTT rewards history
    const demoDttRewards: DttRewards[] = [
      {
        id: "dtt-reward-1",
        userId: demoUser.id,
        action: "round_up",
        amount: "0.10000000",
        transactionId: null,
        paymentId: null,
        transactionHash: null,
        status: "completed",
        metadata: JSON.stringify({ description: "Round-up reward from Starbucks purchase" }),
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "dtt-reward-2", 
        userId: demoUser.id,
        action: "debt_payment",
        amount: "12.50000000",
        transactionId: null,
        paymentId: null,
        transactionHash: null,
        status: "completed",
        metadata: JSON.stringify({ description: "Debt payment reward: $250 payment to Chase Freedom" }),
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        id: "dtt-reward-3",
        userId: demoUser.id,
        action: "milestone",
        amount: "50.00000000",
        transactionId: null,
        paymentId: null,
        transactionHash: null,
        status: "completed",
        metadata: JSON.stringify({ description: "Milestone reward: 25% debt reduction achieved" }),
        createdAt: new Date(Date.now() - 432000000), // 5 days ago
      },
      {
        id: "dtt-reward-4",
        userId: demoUser.id,
        action: "round_up",
        amount: "0.15000000",
        transactionId: null,
        paymentId: null,
        transactionHash: null,
        status: "completed",
        metadata: JSON.stringify({ description: "Round-up reward from Shell Gas purchase" }),
        createdAt: new Date(Date.now() - 518400000), // 6 days ago
      },
      {
        id: "dtt-reward-5",
        userId: demoUser.id,
        action: "daily_login",
        amount: "1.00000000",
        transactionId: null,
        paymentId: null,
        transactionHash: null,
        status: "completed",
        metadata: JSON.stringify({ description: "Daily login bonus" }),
        createdAt: new Date(Date.now() - 604800000), // 7 days ago
      },
    ];
    demoDttRewards.forEach(reward => this.dttRewardsMap.set(reward.id, reward));

    // Create demo DTT staking
    const demoDttStaking: DttStaking[] = [
      {
        id: "dtt-stake-1",
        userId: demoUser.id,
        amount: "125.00000000",
        duration: 90,
        apy: "15.50000000",
        rewardsEarned: "4.25680000",
        status: "active",
        startDate: new Date(Date.now() - 2592000000), // 30 days ago
        endDate: new Date(Date.now() + 5184000000), // 60 days from now
        lastRewardCalculation: new Date(),
        createdAt: new Date(Date.now() - 2592000000),
      },
    ];
    demoDttStaking.forEach(stake => this.dttStakingMap.set(stake.id, stake));
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

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      status: insertNotification.status ?? 'pending',
      priority: insertNotification.priority ?? 'medium',
      sentAt: null,
      deliveredAt: null,
      metadata: insertNotification.metadata ?? null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUserId(userId: string, limit?: number): Promise<Notification[]> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? userNotifications.slice(0, limit) : userNotifications;
  }

  async updateNotificationStatus(id: string, status: string, sentAt?: Date, deliveredAt?: Date): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updated: Notification = {
      ...notification,
      status,
      sentAt: sentAt || notification.sentAt,
      deliveredAt: deliveredAt || notification.deliveredAt,
    };
    this.notifications.set(id, updated);
    return updated;
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings | undefined> {
    return Array.from(this.notificationSettingsMap.values())
      .find(settings => settings.userId === userId);
  }

  async createOrUpdateNotificationSettings(insertSettings: InsertNotificationSettings): Promise<NotificationSettings> {
    const existingSettings = await this.getNotificationSettings(insertSettings.userId);
    
    if (existingSettings) {
      const updated: NotificationSettings = {
        ...existingSettings,
        ...insertSettings,
        updatedAt: new Date(),
      };
      this.notificationSettingsMap.set(existingSettings.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const settings: NotificationSettings = {
        ...insertSettings,
        id,
        smsEnabled: insertSettings.smsEnabled ?? true,
        emailEnabled: insertSettings.emailEnabled ?? true,
        pushEnabled: insertSettings.pushEnabled ?? true,
        phoneNumber: insertSettings.phoneNumber ?? null,
        paymentReminders: insertSettings.paymentReminders ?? true,
        roundupMilestones: insertSettings.roundupMilestones ?? true,
        cryptoUpdates: insertSettings.cryptoUpdates ?? true,
        weeklyReports: insertSettings.weeklyReports ?? true,
        marketingMessages: insertSettings.marketingMessages ?? false,
        updatedAt: new Date(),
      };
      this.notificationSettingsMap.set(id, settings);
      return settings;
    }
  }

  // DTT Token methods
  async getDttHoldings(userId: string): Promise<DttHoldings | undefined> {
    return this.dttHoldingsMap.get(userId);
  }

  async createOrUpdateDttHoldings(holdings: InsertDttHoldings): Promise<DttHoldings> {
    const existing = this.dttHoldingsMap.get(holdings.userId);
    
    if (existing) {
      const updated: DttHoldings = {
        ...existing,
        ...holdings,
        lastActivity: new Date(),
      };
      this.dttHoldingsMap.set(holdings.userId, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newHoldings: DttHoldings = {
        ...holdings,
        id,
        balance: holdings.balance || "0.00000000",
        stakedAmount: holdings.stakedAmount || "0.00000000",
        totalEarned: holdings.totalEarned || "0.00000000",
        lastActivity: new Date(),
        createdAt: new Date(),
      };
      this.dttHoldingsMap.set(holdings.userId, newHoldings);
      return newHoldings;
    }
  }

  async updateDttBalance(userId: string, balance: string, stakedAmount?: string, totalEarned?: string): Promise<DttHoldings | undefined> {
    const existing = this.dttHoldingsMap.get(userId);
    if (!existing) return undefined;
    
    const updated: DttHoldings = {
      ...existing,
      balance,
      stakedAmount: stakedAmount || existing.stakedAmount,
      totalEarned: totalEarned || existing.totalEarned,
      lastActivity: new Date(),
    };
    this.dttHoldingsMap.set(userId, updated);
    return updated;
  }

  async getDttRewardsByUserId(userId: string): Promise<DttRewards[]> {
    return Array.from(this.dttRewardsMap.values())
      .filter(reward => reward.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDttReward(reward: InsertDttRewards): Promise<DttRewards> {
    const id = randomUUID();
    const newReward: DttRewards = {
      ...reward,
      id,
      status: "completed",
      transactionId: reward.transactionId || null,
      paymentId: reward.paymentId || null,
      transactionHash: reward.transactionHash || null,
      metadata: reward.metadata || null,
      createdAt: new Date(),
    };
    this.dttRewardsMap.set(id, newReward);
    return newReward;
  }

  async getDttStakingByUserId(userId: string): Promise<DttStaking[]> {
    return Array.from(this.dttStakingMap.values())
      .filter(stake => stake.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDttStaking(staking: InsertDttStaking): Promise<DttStaking> {
    const id = randomUUID();
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (staking.duration * 24 * 60 * 60 * 1000));
    
    const newStaking: DttStaking = {
      ...staking,
      id,
      startDate,
      endDate,
      status: staking.status || "active",
      rewardsEarned: staking.rewardsEarned || "0.00000000",
      lastRewardCalculation: new Date(),
      createdAt: new Date(),
    };
    this.dttStakingMap.set(id, newStaking);
    return newStaking;
  }

  async updateDttStakingStatus(id: string, status: string): Promise<DttStaking | undefined> {
    const staking = this.dttStakingMap.get(id);
    if (!staking) return undefined;
    
    const updated: DttStaking = {
      ...staking,
      status,
    };
    this.dttStakingMap.set(id, updated);
    return updated;
  }

  async getDttTokenInfo(): Promise<DttTokenInfo | undefined> {
    return this.dttTokenInfoData;
  }

  async updateDttTokenInfo(info: InsertDttTokenInfo): Promise<DttTokenInfo> {
    const updated: DttTokenInfo = {
      id: "dtt-info",
      currentPrice: info.currentPrice || "0.250000",
      marketCap: info.marketCap || "2500000.00",
      volume24h: info.volume24h || "125000.00",
      priceChange24h: info.priceChange24h || "5.25",
      totalSupply: info.totalSupply || "10000000",
      circulatingSupply: info.circulatingSupply || "2500000",
      lastUpdated: new Date(),
    };
    this.dttTokenInfoData = updated;
    return updated;
  }
}

// DatabaseStorage class removed due to incomplete implementation
// Using MemStorage for development as specified in replit.md

export const storage = new MemStorage();
