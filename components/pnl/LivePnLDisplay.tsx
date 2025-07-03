'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket, WS_READY_STATE } from '@/app/utils/wsClient'; // Assuming sendWebSocketMessage can be used for generic messages if needed
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Info, Loader2, WifiOff } from 'lucide-react';
import { Button } from '../ui/button'; // For potential sell button later

interface PnLData {
  currency: string;
  id: number; // ID of the crypto holding
  purchasePrice: number;
  currentPrice: number;
  quantity: number; // This is currently mocked on the server
  pnl: number;
  pnlPercentage: number;
}

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
}

const LivePnLDisplay: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [pnlData, setPnLData] = useState<PnLData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<string>('Disconnected');
  const [sellingItemId, setSellingItemId] = useState<number | null>(null); // To show loading on specific sell button
  const { toast } = useToast();

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    // console.log('Received WS message:', message); // Keep for debugging if necessary
    switch (message.type) {
      case 'auth_success':
        setWsStatus('Connected');
        setError(null);
        break;
      case 'auth_failed':
        setError(`WebSocket Auth Failed: ${message.message}`);
        setWsStatus('Error');
        closeWebSocket(); // Ensure cleanup
        break;
      case 'pnl_update':
        if (Array.isArray(message.data)) {
          // CRITICAL REMINDER: The quantity in message.data is currently MOCKED on the server.
          // This will lead to incorrect P&L values.
          console.warn("P&L data received, but server is using MOCKED QUANTITY. P&L values are not accurate.");
          setPnLData(message.data);
        }
        setIsLoading(false);
        setError(null);
        break;
      case 'error':
        setError(message.message || 'An error occurred with the WebSocket connection.');
        setWsStatus('Error');
        break;
      default:
        console.log('Received unknown WebSocket message type:', message.type);
    }
  }, []);

  const handleWebSocketOpen = useCallback(() => {
    setWsStatus('Connected (Authenticating...)');
    setIsLoading(true); // Expecting data soon
  }, []);

  const handleWebSocketClose = useCallback(() => {
    // Don't set error if it was a clean close or if already an error state
    if (wsStatus !== 'Error' && wsStatus !== 'Disconnected by user') {
         // setError('WebSocket connection closed. Attempting to reconnect or refresh might be needed.');
    }
    if(wsStatus !== 'Disconnected by user') {
        setWsStatus('Disconnected');
    }
    setIsLoading(false);
  }, [wsStatus]);

  const handleWebSocketError = useCallback((event: Event) => {
    console.error('WebSocket error event:', event);
    setError('Failed to connect to live P&L service.');
    setWsStatus('Error');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.id) {
      setWsStatus('Connecting...');
      connectWebSocket(session.user.id, {
        onOpen: handleWebSocketOpen,
        onMessage: handleWebSocketMessage,
        onClose: handleWebSocketClose,
        onError: handleWebSocketError,
      });

      return () => {
        console.log('Closing WebSocket connection from component unmount.');
        setWsStatus('Disconnected by user');
        closeWebSocket();
      };
    } else if (sessionStatus === 'unauthenticated') {
      setError('Please log in to see live P&L data.');
      setIsLoading(false);
      setWsStatus('Disconnected (Not Authenticated)');
    } else {
        // sessionStatus === 'loading'
        setWsStatus('Initializing (Auth Loading...)');
        setIsLoading(true);
    }
  }, [sessionStatus, session, handleWebSocketMessage, handleWebSocketOpen, handleWebSocketClose, handleWebSocketError]);

  const handleSell = async (cryptoId: number, currentSellPrice: number) => {
    if (!cryptoId || !currentSellPrice) {
      toast({ title: "Error", description: "Missing information for sale.", variant: "destructive" });
      return;
    }
    setSellingItemId(cryptoId); // Indicate loading for this specific item

    try {
      const response = await fetch('/api/sell-crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cryptoId: cryptoId, sellPrice: currentSellPrice }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Sale Successful",
          description: result.message || `Successfully sold crypto ID ${cryptoId}.`,
          variant: "default",
        });
        // Optimistic update or wait for WebSocket to refresh
        // For now, let's remove the item from the list or mark as sold client-side
        // setPnLData(prevData => prevData.filter(item => item.id !== cryptoId));
        // A better approach is to wait for the WebSocket server to send updated P&L
        // which should reflect the sale. Forcing a request if WS server doesn't auto-push:
        sendWebSocketMessage({ type: 'request_pnl_update' });
      } else {
        toast({
          title: "Sale Failed",
          description: result.message || "Could not sell crypto.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Sell API call failed:', err);
      toast({
        title: "Network Error",
        description: "Failed to communicate with the server to sell crypto.",
        variant: "destructive",
      });
    } finally {
      setSellingItemId(null);
    }
  };


  if (sessionStatus === 'loading' || (isLoading && wsStatus !== 'Error' && pnlData.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading Live Profit/Loss...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Connecting to live data feed...</p>
          <div className="mt-4 h-32 w-full bg-gray-200 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-red-500">
          <p>{error}</p>
          {wsStatus === 'Error' && <p className="mt-2 text-sm">Status: <Badge variant="destructive">{wsStatus}</Badge></p>}
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-500" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your live profit and loss data.</p>
        </CardContent>
      </Card>
     )
  }

  if (pnlData.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-500" />
            No Active Holdings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have any active cryptocurrency holdings to display P&L for.</p>
          <p className="mt-2 text-sm">Status: <Badge variant={wsStatus === 'Connected' ? 'default' : 'outline'}>{wsStatus}</Badge></p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Live Profit/Loss</CardTitle>
            <Badge variant={wsStatus === 'Connected' ? 'default' : wsStatus === 'Error' ? 'destructive': 'outline'}>
                {wsStatus === 'Connected' && <WifiOff className="mr-1 h-3 w-3 text-green-400 animate-pulse" />}
                {/* Using WifiOff as a placeholder for a generic 'connected' icon style */}
                {wsStatus}
            </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
            Displaying live profit and loss for your active holdings.
            <span className="font-bold text-orange-600 block">
                Note: P&L calculations currently use MOCKED QUANTITIES from the server and are NOT ACCURATE.
            </span>
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">P/L</TableHead>
              <TableHead className="text-right">P/L %</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pnlData.map((item) => (
              <TableRow key={item.id} className={sellingItemId === item.id ? 'opacity-50' : ''}>
                <TableCell className="font-medium">{item.currency}</TableCell>
                <TableCell className="text-right">
                  {item.quantity.toFixed(4)}
                  {/* The PnL server still sends mock quantity, so this will be wrong until that's fixed */}
                  {/* <span className="text-red-500">*</span> */}
                </TableCell>
                <TableCell className="text-right">${item.purchasePrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${item.currentPrice.toFixed(2)}</TableCell>
                <TableCell className={`text-right font-semibold ${item.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.pnl >= 0 ? <ArrowUpRight className="inline h-4 w-4 mr-1" /> : <ArrowDownRight className="inline h-4 w-4 mr-1" />}
                  ${item.pnl.toFixed(2)}
                </TableCell>
                <TableCell className={`text-right ${item.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.pnlPercentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSell(item.id, item.currentPrice)}
                    disabled={sellingItemId === item.id || wsStatus !== 'Connected'}
                  >
                    {sellingItemId === item.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-2">
            <span className="text-red-500 font-semibold">* Important:</span> The WebSocket server currently provides MOCKED QUANTITY data for P&L display.
            However, the actual sell operation uses the correct quantity derived from your purchase history.
            The P&L values shown are illustrative until the WebSocket server is updated to send accurate quantities.
        </p>
      </CardContent>
    </Card>
  );
};

export default LivePnLDisplay;
