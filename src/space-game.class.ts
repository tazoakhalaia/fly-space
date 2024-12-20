import { Assets, Container, Sprite, Text} from "pixi.js";

export class SpaceGame {
  private _container = new Container();
  private _socket?: WebSocket;
  private _points: number = 0;
  private _hearts: number = 0;

  get container() {
    this.init();
    return this._container;
  }

  init() {
    const bg = new Sprite(Assets.get("bg"));
    bg.setSize(850, 600);
    this._container.addChild(bg);
    this.drawPlanets();
    this.connectWebSocket();
    this.drawPoints();
    this.drawHearts();
  }

  connectWebSocket() {
    this._socket = new WebSocket(
      "wss://socket.ifrine.com/fast?sid=837decc5eeeb457296aa7293e40b69ae3"
    );

    this._socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      this._points = JSON.parse(event.data).points;
      this._hearts = JSON.parse(event.data).hearts;
    };
  }

  drawPlanets() {
    const planetsCordsX = [40, 70, 140, 300, 280, 400, 600, 550, 680];
    const planetsCordsY = [90, 250, 400, 210, 50, 400, 420, 200, 70];
    for (let i = 1; i <= 9; i++) {
      const planet = new Sprite(Assets.get(`planet${i}`));
      planet.setSize(110, 100);
      planet.position.set(planetsCordsX[i - 1], planetsCordsY[i - 1]);
      this._container.addChild(planet);
    }
  }

  drawPoints() {
    const pointsText = new Text({text: `Points: ${this._points}`});
    pointsText.style = {
        fill: 'white',
        fontWeight: 'bolder'
    }
    this._container.addChild(pointsText);
  }

  drawHearts() {
    const heartsText = new Text({text: `Hearts: ${this._hearts}`});
    heartsText.style = {
        fill: 'white',
        fontWeight: 'bolder'
    }
    heartsText.position.set(0, 30);
    this._container.addChild(heartsText);
  }

  destroy() {
    this._container.destroy();
    if (this._socket) {
      this._socket.close();
    }
  }
}
