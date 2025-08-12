import crypto from 'crypto';
import { storage } from '../storage';

interface CoinbaseOrder {
  id: string;
  size: string;
  funds: string;
  side: 'buy' | 'sell';
  product_id: string;
  status: string;
}

export class CoinbaseService {
  private apiKey: string;
  private apiSecret: string;
  private passphrase: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.COINBASE_API_KEY!;
    this.apiSecret = process.env.COINBASE_API_SECRET!;
    this.passphrase = process.env.COINBASE_PASSPHRASE!;
    this.baseUrl = 'https://api.exchange.coinbase.com';
  }

  private generateSignature(timestamp: string, method: string, requestPath: string, body: string = '') {
    const message = timestamp + method.toUpperCase() + requestPath + body;
    return crypto.createHmac('sha256', Buffer.from(this.apiSecret, 'base64')).update(message).digest('base64');
  }

  private async makeRequest(method: string, path: string, body?: any) {
    const timestamp = Date.now() / 1000;
    const bodyString = body ? JSON.stringify(body) : '';
    const signature = this.generateSignature(timestamp.toString(), method, path, bodyString);

    const headers = {
      'CB-ACCESS-KEY': this.apiKey,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp.toString(),
      'CB-ACCESS-PASSPHRASE': this.passphrase,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: bodyString || undefined,
      });

      if (!response.ok) {
        throw new Error(`Coinbase API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Coinbase API request failed:', error);
      throw new Error('Failed to communicate with Coinbase');
    }
  }

  async getCurrentPrice(cryptoSymbol: string): Promise<number> {
    try {
      const response = await fetch(`https://api.coinbase.com/v2/prices/${cryptoSymbol}-USD/spot`);
      const data = await response.json();
      return parseFloat(data.data.amount);
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      throw new Error('Failed to get current crypto price');
    }
  }

  async placeBuyOrder(cryptoSymbol: string, amountUsd: number): Promise<CoinbaseOrder> {
    try {
      const productId = `${cryptoSymbol}-USD`;
      const orderRequest = {
        type: 'market',
        side: 'buy',
        product_id: productId,
        funds: amountUsd.toFixed(2),
      };

      const order = await this.makeRequest('POST', '/orders', orderRequest);
      return order;
    } catch (error) {
      console.error('Error placing Coinbase buy order:', error);
      throw new Error('Failed to purchase cryptocurrency');
    }
  }

  async getOrderStatus(orderId: string): Promise<CoinbaseOrder> {
    try {
      return await this.makeRequest('GET', `/orders/${orderId}`);
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw new Error('Failed to get order status');
    }
  }

  async purchaseCryptoWithRoundUp(
    userId: string,
    transactionId: string,
    roundUpAmount: number,
    cryptoSymbol: string
  ) {
    try {
      // Get current crypto price
      const currentPrice = await this.getCurrentPrice(cryptoSymbol);
      
      // Calculate crypto amount
      const cryptoAmount = roundUpAmount / currentPrice;

      // Create crypto purchase record
      const cryptoPurchase = await storage.createCryptoPurchase({
        userId,
        transactionId,
        cryptoSymbol,
        amountUsd: roundUpAmount.toFixed(2),
        cryptoAmount: cryptoAmount.toFixed(8),
        purchasePrice: currentPrice.toFixed(2),
      });

      try {
        // Place buy order with Coinbase
        const order = await this.placeBuyOrder(cryptoSymbol, roundUpAmount);
        
        // Update purchase record with order ID
        await storage.updateCryptoPurchaseStatus(
          cryptoPurchase.id,
          'completed',
          order.id
        );

        return {
          ...cryptoPurchase,
          status: 'completed',
          coinbaseOrderId: order.id,
        };
      } catch (orderError) {
        // Update purchase record as failed
        await storage.updateCryptoPurchaseStatus(cryptoPurchase.id, 'failed');
        throw orderError;
      }
    } catch (error) {
      console.error('Error purchasing crypto with round-up:', error);
      throw new Error('Failed to purchase cryptocurrency with round-up');
    }
  }

  async getPortfolioSummary(userId: string) {
    try {
      const purchases = await storage.getCryptoPurchasesByUserId(userId);
      
      const summary = purchases.reduce((acc, purchase) => {
        const symbol = purchase.cryptoSymbol;
        if (!acc[symbol]) {
          acc[symbol] = {
            symbol,
            totalInvested: 0,
            totalAmount: 0,
            averagePrice: 0,
            purchaseCount: 0,
          };
        }
        
        acc[symbol].totalInvested += parseFloat(purchase.amountUsd);
        acc[symbol].totalAmount += parseFloat(purchase.cryptoAmount);
        acc[symbol].purchaseCount += 1;
        
        return acc;
      }, {} as Record<string, any>);

      // Calculate average prices
      Object.values(summary).forEach((crypto: any) => {
        crypto.averagePrice = crypto.totalAmount > 0 ? crypto.totalInvested / crypto.totalAmount : 0;
      });

      return Object.values(summary);
    } catch (error) {
      console.error('Error getting portfolio summary:', error);
      throw new Error('Failed to get crypto portfolio summary');
    }
  }
}

export const coinbaseService = new CoinbaseService();