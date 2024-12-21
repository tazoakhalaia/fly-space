import { Assets, Container, Sprite, Text } from "pixi.js";
import { Socket } from "./socket.class";

export class SpaceGame {
  private _container = new Container();
  private socket = new Socket();
  private _points: any;
  private _hearts: number = 0;

  constructor() {
    this.socket.connectWebSocket();
    this.socket.onDataReceived((data) => {
      this.drawPoints(data.data.state.points);
      this.drawHearts(data.data.state.hearts);
    });
  }

  get container() {
    this.init();
    return this._container;
  }

  init() {
    const bg = new Sprite(Assets.get("bg"));
    bg.setSize(850, 600);
    this._container.addChild(bg);
    this.drawPlanets();
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

  drawPoints(points: number = 0) {
    const pointsText = new Text({ text: `Points: ${points}` });
    pointsText.style = {
      fill: "white",
      fontWeight: "bolder",
    };
    this._container.addChild(pointsText);
  }

  drawHearts(hearts: number = 0) {
    const heartsText = new Text({ text: `Hearts: ${hearts}` });
    heartsText.style = {
      fill: "white",
      fontWeight: "bolder",
    };
    heartsText.position.set(0, 30);
    this._container.addChild(heartsText);
  }

  destroy() {
    this._container.destroy();
    if (this.socket) {
      this.socket.sendAction({ action: "DISCONNECT" });
    }
  }
}
