import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const debts = pgTable("debts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull(),
  originalBalance: decimal("original_balance", { precision: 10, scale: 2 }).notNull(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  minimumPayment: decimal("minimum_payment", { precision: 10, scale: 2 }).notNull(),
  dueDate: integer("due_date").notNull(), // day of month
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  merchant: text("merchant").notNull(),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  roundUpAmount: decimal("round_up_amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  description: text("description"),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  debtId: varchar("debt_id").notNull().references(() => debts.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(), // 'round_up', 'manual', 'scheduled'
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").default('completed').notNull(),
});

export const roundUpSettings = pgTable("round_up_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default('1.00').notNull(), // 1.00 = normal, 2.00 = double round-ups
  autoApplyThreshold: decimal("auto_apply_threshold", { precision: 10, scale: 2 }).default('25.00').notNull(),
  cryptoEnabled: boolean("crypto_enabled").default(false).notNull(),
  cryptoPercentage: decimal("crypto_percentage", { precision: 5, scale: 2 }).default('0.00').notNull(), // 0-100%
  preferredCrypto: text("preferred_crypto").default('BTC').notNull(),
});

export const cryptoPurchases = pgTable("crypto_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  transactionId: varchar("transaction_id").references(() => transactions.id),
  cryptoSymbol: text("crypto_symbol").notNull(),
  amountUsd: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  cryptoAmount: decimal("crypto_amount", { precision: 18, scale: 8 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  coinbaseOrderId: text("coinbase_order_id"),
  status: text("status").default('pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bankAccounts = pgTable("bank_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  plaidItemId: text("plaid_item_id").notNull().unique(),
  plaidAccessToken: text("plaid_access_token").notNull(),
  accountId: text("account_id").notNull(),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(), // checking, savings, credit
  institutionName: text("institution_name").notNull(),
  mask: text("mask"), // last 4 digits
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  deviceType: text("device_type").notNull(), // web, mobile
  deviceId: text("device_id"),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
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
  date: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  date: true,
  status: true,
});

export const insertRoundUpSettingsSchema = createInsertSchema(roundUpSettings).omit({
  id: true,
});

// Sweep Account for JP Morgan Chase integration
export const sweepAccounts = pgTable("sweep_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  jpMorganAccountId: varchar("jp_morgan_account_id").notNull(),
  accountNumber: varchar("account_number").notNull(),
  routingNumber: varchar("routing_number").notNull(),
  accountType: varchar("account_type").notNull().default("sweep"), // sweep, checking, savings
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 4 }).notNull().default("0.0200"), // 2%
  status: varchar("status").notNull().default("active"), // active, inactive, suspended
  lastInterestCalculation: timestamp("last_interest_calculation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Round-up Collections in Sweep Account
export const sweepDeposits = pgTable("sweep_deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sweepAccountId: varchar("sweep_account_id").notNull().references(() => sweepAccounts.id),
  transactionId: varchar("transaction_id").references(() => transactions.id),
  roundUpAmount: decimal("round_up_amount", { precision: 10, scale: 2 }).notNull(),
  interestEarned: decimal("interest_earned", { precision: 10, scale: 6 }).notNull().default("0.000000"),
  depositDate: timestamp("deposit_date").defaultNow(),
  status: varchar("status").notNull().default("collected"), // collected, earning_interest, dispersed
});

// Friday Debt Dispersals
export const weeklyDispersals = pgTable("weekly_dispersals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sweepAccountId: varchar("sweep_account_id").notNull().references(() => sweepAccounts.id),
  dispersalDate: timestamp("dispersal_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  principalAmount: decimal("principal_amount", { precision: 12, scale: 2 }).notNull(),
  interestAmount: decimal("interest_amount", { precision: 12, scale: 6 }).notNull(),
  targetDebtId: varchar("target_debt_id").references(() => debts.id),
  jpMorganTransactionId: varchar("jp_morgan_transaction_id"),
  status: varchar("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new tables
export const insertSweepAccountSchema = createInsertSchema(sweepAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSweepDepositSchema = createInsertSchema(sweepDeposits).omit({
  id: true,
  depositDate: true,
});

export const insertWeeklyDispersalSchema = createInsertSchema(weeklyDispersals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports for new tables
export type SweepAccount = typeof sweepAccounts.$inferSelect;
export type InsertSweepAccount = z.infer<typeof insertSweepAccountSchema>;

export type SweepDeposit = typeof sweepDeposits.$inferSelect;
export type InsertSweepDeposit = z.infer<typeof insertSweepDepositSchema>;

export type WeeklyDispersal = typeof weeklyDispersals.$inferSelect;
export type InsertWeeklyDispersal = z.infer<typeof insertWeeklyDispersalSchema>;

export const insertCryptoPurchaseSchema = createInsertSchema(cryptoPurchases).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

// Types
export type User = typeof users.$inferSelect;

// Dime Time Token (DTT) tables
export const dimeTokenRewards = pgTable("dime_token_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // 'round_up', 'debt_payment', 'referral', etc.
  amount: varchar("amount").notNull(), // DTT amount as string for precision
  transactionHash: varchar("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dimeTokenBalances = pgTable("dime_token_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  balance: varchar("balance").notNull().default('0'), // DTT balance
  stakedAmount: varchar("staked_amount").notNull().default('0'), // Currently staked DTT
  totalEarned: varchar("total_earned").notNull().default('0'), // Lifetime DTT earned
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dimeTokenStaking = pgTable("dime_token_staking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stakedAmount: varchar("staked_amount").notNull(),
  stakingDuration: integer("staking_duration").notNull(), // days
  apy: varchar("apy").notNull(), // annual percentage yield as string
  rewardsAccrued: varchar("rewards_accrued").notNull().default('0'),
  startDate: timestamp("start_date").defaultNow(),
  maturityDate: timestamp("maturity_date").notNull(),
  status: varchar("status").notNull().default('active'), // 'active', 'matured', 'withdrawn'
  createdAt: timestamp("created_at").defaultNow(),
});

export type DimeTokenReward = typeof dimeTokenRewards.$inferSelect;
export type InsertDimeTokenReward = typeof dimeTokenRewards.$inferInsert;
export type DimeTokenBalance = typeof dimeTokenBalances.$inferSelect;
export type InsertDimeTokenBalance = typeof dimeTokenBalances.$inferInsert;
export type DimeTokenStaking = typeof dimeTokenStaking.$inferSelect;
export type InsertDimeTokenStaking = typeof dimeTokenStaking.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = z.infer<typeof insertDebtSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type RoundUpSettings = typeof roundUpSettings.$inferSelect;
export type InsertRoundUpSettings = z.infer<typeof insertRoundUpSettingsSchema>;

export type CryptoPurchase = typeof cryptoPurchases.$inferSelect;
export type InsertCryptoPurchase = z.infer<typeof insertCryptoPurchaseSchema>;

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'sms', 'email', 'push', 'system'
  channel: text("channel").notNull(), // 'sms', 'email', 'push', 'toast'
  title: text("title").notNull(),
  message: text("message").notNull(),
  recipient: text("recipient").notNull(), // phone number for SMS, email for email
  status: text("status").notNull().default('pending'), // 'pending', 'sent', 'delivered', 'failed'
  priority: text("priority").notNull().default('medium'), // 'low', 'medium', 'high'
  metadata: text("metadata"), // JSON string for additional data
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User notification preferences
export const notificationSettings = pgTable("notification_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  smsEnabled: boolean("sms_enabled").default(true).notNull(),
  emailEnabled: boolean("email_enabled").default(true).notNull(),
  pushEnabled: boolean("push_enabled").default(true).notNull(),
  phoneNumber: text("phone_number"), // User's phone number for SMS
  paymentReminders: boolean("payment_reminders").default(true).notNull(),
  roundupMilestones: boolean("roundup_milestones").default(true).notNull(),
  cryptoUpdates: boolean("crypto_updates").default(true).notNull(),
  weeklyReports: boolean("weekly_reports").default(true).notNull(),
  marketingMessages: boolean("marketing_messages").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas for notifications
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  sentAt: true,
  deliveredAt: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
  id: true,
  updatedAt: true,
});

// Types for notifications
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;
