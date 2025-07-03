// app/utils/wsClient.ts

const WS_URL = `ws://localhost:${process.env.NEXT_PUBLIC_WS_PORT || 8080}`; // Ensure your WS server port is accessible

interface WebSocketHandler {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

let socket: WebSocket | null = null;
let messageQueue: string[] = []; // Queue messages if socket is not yet open

export function connectWebSocket(userId: string, handlers: WebSocketHandler): WebSocket | null {
  if (!userId) {
    console.error("WebSocket connection requires a userId for authentication.");
    handlers.onError?.(new ErrorEvent("UserId required for WebSocket connection."));
    return null;
  }

  // Use the userId as the token for this example
  // In a real app, this should be a secure session token or JWT
  const token = userId;
  const urlWithToken = `${WS_URL}?token=${encodeURIComponent(token)}`;

  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('WebSocket already connected.');
    // If handlers are different, could update them here or enforce single handler set
    return socket;
  }

  if (socket && socket.readyState === WebSocket.CONNECTING) {
    console.log('WebSocket connection in progress.');
    return socket;
  }

  console.log(`Attempting to connect to WebSocket: ${urlWithToken}`);
  socket = new WebSocket(urlWithToken);

  socket.onopen = () => {
    console.log('WebSocket connection established.');
    handlers.onOpen?.();
    // Send any queued messages
    messageQueue.forEach(msg => socket?.send(msg));
    messageQueue = [];
  };

  socket.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data as string);
      handlers.onMessage?.(parsedData);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      handlers.onMessage?.(event.data); // Send raw data if JSON parsing fails
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed.', event.code, event.reason);
    handlers.onClose?.();
    socket = null; // Clear the socket instance for potential reconnection
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    handlers.onError?.(error);
    // Socket usually closes after an error, onclose handler will also be called.
  };

  return socket;
}

export function sendWebSocketMessage(message: object) {
  const msgString = JSON.stringify(message);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(msgString);
  } else {
    console.warn('WebSocket not open. Queuing message:', msgString);
    messageQueue.push(msgString);
    // Optionally, you could try to auto-reconnect here if the socket is null or closed
  }
}

export function closeWebSocket() {
  if (socket) {
    socket.close();
  }
}

export function getWebSocketState(): number | null {
    return socket?.readyState ?? null;
}

// Re-export WebSocket ready states for convenience in components
export const WS_READY_STATE = {
  CONNECTING: WebSocket.CONNECTING, // 0
  OPEN: WebSocket.OPEN,             // 1
  CLOSING: WebSocket.CLOSING,       // 2
  CLOSED: WebSocket.CLOSED          // 3
};
