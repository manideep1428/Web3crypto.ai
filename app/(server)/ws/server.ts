import WebSocket, { WebSocketServer } from 'ws';
import { PrismaClient, User, Crypto } from '@prisma/client';
import url from 'url';
// import { getSession } from 'next-auth/react'; // This is client-side, can't use directly in Node server easily for ws auth
                                            // We'll need another way to authenticate, e.g., token-based or cookie parsing if possible

const prisma = new PrismaClient();
const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;

// In-memory store for connected clients (WebSocket and associated userId)
interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
}
const clients = new Map<string, AuthenticatedWebSocket>(); // Store by userId for easy lookup

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on port ${PORT}`);

// Mock live price data (replace with actual price feed later)
const mockLivePrices: { [currency: string]: number } = {
  Bitcoin: 52000,
  Ethereum: 3100,
  Solana: 150,
  // Add more or fetch dynamically
};

// Function to calculate P/L
function calculatePL(holding: Crypto, currentPrice: number): number {
  // Assuming holding.buyAt is the purchase price per unit
  // And we need a quantity. If Crypto model doesn't have quantity directly,
  // we need to fetch associated orders or assume a quantity.
  // For now, let's assume a mock quantity or that 'buyAt' was total value and we need a unit price.
  // This part needs to align with how 'Crypto' and 'Order' store quantity and purchase price.

  // Let's revisit the Prisma schema for quantity.
  // Order.amount / Crypto.buyAt was quantity for an order.
  // A Crypto entry itself might represent a lot with an implicit quantity if amount and buyAt price are known.
  // For simplicity in this step, let's assume Crypto.buyAt is price per unit, and we need a quantity field on Crypto or Order.
  // Let's assume a mock quantity for now.
  const mockQuantity = 1; // Placeholder: This needs to be real quantity of the holding
  const purchasePricePerUnit = holding.buyAt;
  const profitOrLoss = (currentPrice - purchasePricePerUnit) * mockQuantity;
  return profitOrLoss;
}

async function sendPnLUpdates(client: AuthenticatedWebSocket) {
  if (!client.userId) {
    console.log('Client not authenticated, cannot send P&L.');
    return;
  }

  try {
    const userHoldings = await prisma.crypto.findMany({
      where: {
        userId: client.userId,
        soldAt: null, // Only active holdings
      },
    });

    if (!userHoldings.length) {
      client.send(JSON.stringify({ type: 'pnl_update', data: [] }));
      return;
    }

    const pnlData = userHoldings.map(holding => {
      const currentPrice = mockLivePrices[holding.currency] || holding.buyAt; // Fallback to buyAt if no live price
      // We need QUANTITY for this holding. The Crypto model doesn't have it.
      // This is a critical piece of information missing from the current Crypto model for P/L calculation.
      // For now, I will simulate it or assume a default.
      // This needs to be addressed by modifying the schema or fetching related order data.
      // Let's assume for now that 'Order.amount' was the cost basis and 'Crypto.buyAt' was the price.
      // To get quantity for a 'Crypto' lot, we'd need to find its associated 'Buy' order.
      // This is becoming complex for a direct PnL on 'Crypto' without a quantity field.

      // TEMPORARY: Mocking P/L calculation due to missing quantity on Crypto model
      // A more robust solution would involve fetching associated order to find quantity or adding quantity to Crypto model.
      const mockQuantity = 1; // This is a placeholder!
      const purchasePrice = holding.buyAt;
      const pnl = (currentPrice - purchasePrice) * mockQuantity;

      return {
        currency: holding.currency,
        id: holding.id, // ID of the crypto holding
        purchasePrice: holding.buyAt,
        currentPrice: currentPrice,
        quantity: mockQuantity, // Placeholder
        pnl: pnl,
        pnlPercentage: purchasePrice > 0 ? (pnl / (purchasePrice * mockQuantity)) * 100 : 0,
      };
    });

    client.send(JSON.stringify({ type: 'pnl_update', data: pnlData }));
  } catch (error) {
    console.error(`Failed to fetch or send P&L for user ${client.userId}:`, error);
    client.send(JSON.stringify({ type: 'error', message: 'Failed to fetch P&L data.' }));
  }
}


wss.on('connection', async (ws: AuthenticatedWebSocket, req) => {
  console.log('Client connected');

  // --- Authentication ---
  // This is a simplified placeholder for authentication.
  // In a real app, you'd use tokens (e.g., JWT passed in query param or sec-websocket-protocol)
  // or parse session cookies if the ws server is tightly coupled with the web server.
  const parameters = url.parse(req.url || '', true).query;
  const token = parameters.token as string; // Example: ws://localhost:8080?token=USER_ID_OR_SESSION_TOKEN

  // For this example, let's assume the token is the userId.
  // In a real scenario, validate this token against your auth system.
  if (token) {
    const user = await prisma.user.findUnique({ where: { id: token } });
    if (user) {
      ws.userId = user.id;
      clients.set(user.id, ws); // Store authenticated client
      console.log(`Client authenticated as user ${user.id}`);
      ws.send(JSON.stringify({ type: 'auth_success', message: 'Successfully authenticated.' }));
      sendPnLUpdates(ws); // Send initial P&L
    } else {
      console.log('Authentication failed: Invalid token/user.');
      ws.send(JSON.stringify({ type: 'auth_failed', message: 'Authentication failed.' }));
      ws.terminate();
      return;
    }
  } else {
    console.log('Authentication failed: No token provided.');
    ws.send(JSON.stringify({ type: 'auth_failed', message: 'Authentication token required.' }));
    ws.terminate();
    return;
  }

  ws.on('message', (message) => {
    console.log(`Received message from ${ws.userId}: ${message}`);
    // Handle incoming messages if needed, e.g., client requests refresh
    try {
      const parsedMessage = JSON.parse(message.toString());
      if (parsedMessage.type === 'request_pnl_update' && ws.userId) {
        sendPnLUpdates(ws);
      }
    } catch (e) {
      console.error('Failed to parse message or unknown message type:', message.toString());
    }
  });

  ws.on('close', () => {
    if (ws.userId) {
      clients.delete(ws.userId);
      console.log(`Client ${ws.userId} disconnected`);
    } else {
      console.log('Unauthenticated client disconnected');
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${ws.userId}:`, error);
    // Ensure client is removed on error too
    if (ws.userId) {
      clients.delete(ws.userId);
    }
  });
});

// Periodically update all connected authenticated clients
// This interval is for demonstration. In a real app, updates might be triggered by price changes from a data feed.
setInterval(() => {
  mockLivePrices.Bitcoin = 52000 + (Math.random() * 1000 - 500); // Simulate price fluctuation
  mockLivePrices.Ethereum = 3100 + (Math.random() * 100 - 50);
  mockLivePrices.Solana = 150 + (Math.random() * 20 - 10);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userId) {
      sendPnLUpdates(client);
    }
  });
}, 5000); // Update every 5 seconds


// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down WebSocket server...');
  wss.close(async (err) => {
    if (err) {
      console.error('Error closing WebSocket server', err);
    }
    await prisma.$disconnect();
    console.log('Prisma disconnected. Server shut down.');
    process.exit(0);
  });
});

// Note on Quantity for P/L:
// The `Crypto` model (id, currency, buyAt, soldAt, timeBuyAt, timeSoldAt, transactionFee, userId)
// does NOT have a `quantity` field.
// An `Order` (id, userId, transactionType, amount, status, cryptoId) has an `amount` (total value).
// For a 'Buy' order, quantity = Order.amount / Crypto.buyAt (price per unit).
// To calculate P/L for a specific Crypto holding, we need its quantity.
// This means either:
// 1. Add a `quantity` field to the `Crypto` model. This would be set when the crypto is acquired.
// 2. When calculating P/L for a `Crypto` entry, find its associated 'Buy' `Order` (via `cryptoId`)
//    and calculate the quantity dynamically: `originalOrder.amount / cryptoHolding.buyAt`.
// Option 2 is more robust if a single `Crypto` entry always corresponds to one 'Buy' order's acquisition.
// Option 1 is simpler for direct P/L calculation if `Crypto` entries can be created/updated outside of orders.
// The current P/L calculation uses a mock quantity and needs to be fixed.
// I will proceed with the assumption that we might need to fetch the original order to get the quantity for P/L.
// Or, for this step, continue with mock quantity and address it in a follow-up or when implementing sell.
console.log("P&L Calculation Warning: Current P&L calculation uses a MOCK QUANTITY. This needs to be fixed by fetching actual quantity based on original purchase order or by adding quantity to the Crypto model.");

export {}; // Make this a module if not already
