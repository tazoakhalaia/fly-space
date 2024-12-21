export class Socket {
  private _socket?: WebSocket;
  private _data: any;
  private _onDataReceived: ((data: any) => void) | null = null;

  connectWebSocket() {
    this._socket = new WebSocket(
      "wss://socket.ifrine.com/fast?sid=837decc5eeeb457296aa7293e40b69ae3"
    );

    this._socket.onmessage = (event) => {
      this._data = JSON.parse(event.data);
      if (this._onDataReceived) {
        this._onDataReceived(this._data);
      }
    };
  }

  sendAction(action: object) {
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
