export class Socket {
  private static instance: Socket;
  private _socket?: WebSocket;
  private _data: any;
  private _onDataReceived: ((data: any) => void) | null = null;

  private constructor() {}

  public static getInstance(): Socket {
    if (!Socket.instance) {
      Socket.instance = new Socket();
    }
    return Socket.instance;
  }

  connectWebSocket() {
    this._socket = new WebSocket(
      "wss://socket.ifrine.com/fast?sid=d5523cbf0ed5448b99c70122535d4f4c1"
    );

    this._socket.onmessage = (event) => {
      this._data = JSON.parse(event.data);
      if (this._onDataReceived && this._data) {
        this._onDataReceived(this._data);
      }
    };
  }

  sendAction(action: any) {
    if (this._socket && this._socket.readyState === WebSocket.OPEN) {
      this._socket.send(JSON.stringify(action));
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        this._socket?.readyState
      );
    }
  }

  onDataReceived(callback: (data: any) => void) {
    this._onDataReceived = callback;
  }
}
