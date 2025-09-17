import type { Express, Request, Response } from "express";
import { silaService } from "../services/silaService";
import { mockSilaService } from "../services/mockSilaService";
import { z } from "zod";

const registerUserSchema = z.object({
  handle: z.string().min(1, "User handle is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  street_address_1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  postal_code: z.string().min(5, "Valid postal code required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  identity_value: z.string().min(9, "SSN/EIN required")
});

const linkAccountSchema = z.object({
  user_handle: z.string().min(1, "User handle is required"),
  account_name: z.string().min(1, "Account name is required"),
  account_type: z.enum(["CHECKING", "SAVINGS"]),
  account_number: z.string().min(1, "Account number is required"),
  routing_number: z.string().length(9, "Routing number must be 9 digits"),
  account_owner_name: z.string().min(1, "Account owner name is required")
});

const transferSchema = z.object({
  user_handle: z.string().min(1, "User handle is required"),
  amount: z.number().positive("Amount must be positive"),
  account_name: z.string().min(1, "Account name is required"),
  descriptor: z.string().optional()
});

export function registerSilaRoutes(app: Express) {
  
  // Determine which service to use (mock or real)
  const getActiveService = () => {
    // Use mock mode by default for beta testing (since real Sila requires complex Ed25519 signatures)
    const mode = process.env.SILA_MODE || 'mock';
    return mode === 'mock' ? mockSilaService : silaService;
  };
  
  // Check Sila service status
  app.get("/api/sila/status", async (req: Request, res: Response) => {
    try {
      const service = getActiveService();
      const configured = service.isServiceConfigured();
      const environment = service.getEnvironment();
      const mode = process.env.SILA_MODE || 'mock';
      
      res.json({
        configured,
        environment: mode === 'mock' ? 'mock' : environment,
        mode,
        message: configured 
          ? `Sila Money service ready (${mode === 'mock' ? 'MOCK' : environment})`
          : "Sila service not configured - missing credentials"
      });
    } catch (error) {
      console.error('Error checking Sila status:', error);
      res.status(500).json({ message: "Failed to check Sila service status" });
    }
  });

  // Register a demo user (for testing)
  app.post("/api/sila/register-demo-user", async (req: Request, res: Response) => {
    try {
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ 
          message: "Sila service not configured" 
        });
      }

      const userId = req.body.userId || "demo-user-1";
      const demoUser = service.createDemoUser(userId);
      
      const result = await service.registerUser(demoUser);
      
      res.json({
        success: result.success,
        message: result.message,
        user_handle: demoUser.handle,
        reference: result.reference,
        mode: process.env.SILA_MODE || 'mock'
      });
    } catch (error) {
      console.error('Error registering demo user:', error);
      res.status(500).json({ message: "Failed to register demo user" });
    }
  });

  // Register a user
  app.post("/api/sila/register-user", async (req: Request, res: Response) => {
    try {
      const userData = registerUserSchema.parse(req.body);
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ message: "Sila service not configured" });
      }

      const silaUser = {
        handle: userData.handle,
        first_name: userData.first_name,
        last_name: userData.last_name,
        address: {
          address_alias: 'home',
          street_address_1: userData.street_address_1,
          city: userData.city,
          state: userData.state,
          country: 'US',
          postal_code: userData.postal_code
        },
        identity: {
          identity_alias: 'ssn',
          identity_value: userData.identity_value
        },
        contact: {
          phone: userData.phone,
          email: userData.email
        }
      };

      const result = await service.registerUser(silaUser);
      
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error registering user:', error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Link bank account
  app.post("/api/sila/link-account", async (req: Request, res: Response) => {
    try {
      const accountData = linkAccountSchema.parse(req.body);
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ message: "Sila service not configured" });
      }

      const bankAccount = {
        account_name: accountData.account_name,
        account_type: accountData.account_type,
        account_number: accountData.account_number,
        routing_number: accountData.routing_number,
        account_owner_name: accountData.account_owner_name
      };

      const result = await service.linkAccount(accountData.user_handle, bankAccount);
      
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error linking account:', error);
      res.status(500).json({ message: "Failed to link bank account" });
    }
  });

  // Collect round-up (issue to wallet)
  app.post("/api/sila/collect-roundup", async (req: Request, res: Response) => {
    try {
      const transferData = transferSchema.parse(req.body);
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ message: "Sila service not configured" });
      }

      const result = await service.issueToWallet(
        transferData.user_handle,
        transferData.amount,
        transferData.account_name,
        transferData.descriptor || `Dime Time round-up collection: $${transferData.amount}`
      );
      
      res.status(201).json({
        success: true,
        transfer: result,
        message: `Successfully initiated round-up collection of $${transferData.amount}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error collecting round-up:', error);
      res.status(500).json({ message: "Failed to collect round-up" });
    }
  });

  // Pay debt (redeem from wallet)
  app.post("/api/sila/pay-debt", async (req: Request, res: Response) => {
    try {
      const transferData = transferSchema.parse(req.body);
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ message: "Sila service not configured" });
      }

      const result = await service.redeemFromWallet(
        transferData.user_handle,
        transferData.amount,
        transferData.account_name,
        transferData.descriptor || `Dime Time debt payment: $${transferData.amount}`
      );
      
      res.status(201).json({
        success: true,
        transfer: result,
        message: `Successfully initiated debt payment of $${transferData.amount}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error paying debt:', error);
      res.status(500).json({ message: "Failed to pay debt" });
    }
  });

  // Get wallet balance
  app.get("/api/sila/wallet/:user_handle", async (req: Request, res: Response) => {
    try {
      const userHandle = req.params.user_handle;
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ message: "Sila service not configured" });
      }

      const balance = await service.getWalletBalance(userHandle);
      
      res.json({
        user_handle: userHandle,
        balance: balance.balance,
        currency: balance.currency,
        formatted_balance: `$${balance.balance.toFixed(2)}`
      });
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      res.status(500).json({ message: "Failed to get wallet balance" });
    }
  });

  // Get transaction status
  app.get("/api/sila/transaction/:user_handle/:transaction_id", async (req: Request, res: Response) => {
    try {
      const { user_handle, transaction_id } = req.params;
      const service = getActiveService();
      
      if (!service.isServiceConfigured()) {
        return res.status(503).json({ message: "Sila service not configured" });
      }

      const status = await service.getTransactionStatus(user_handle, transaction_id);
      
      res.json({
        user_handle,
        transaction_id,
        status: status.status,
        message: status.message
      });
    } catch (error) {
      console.error('Error getting transaction status:', error);
      res.status(500).json({ message: "Failed to get transaction status" });
    }
  });
}