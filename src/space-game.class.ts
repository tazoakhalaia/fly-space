import { Assets, Container, Sprite, Text, Ticker } from "pixi.js";
import { Socket } from "./socket.class";

export class SpaceGame {
  private _container = new Container();
  private heartsText = new Text({ text: 0 });
  private pointesText = new Text({ text: 0 });
  private timerText = new Text({ text: 0 });
  private planetArr: Sprite[] = [];
  private saveCollectPlanetIndex: number[] = [];
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    const socket = Socket.getInstance();
    socket.onDataReceived((data) => {
      this.drawPoints(data.data.points);
      this.drawHearts(data.data.hearts);
      this.blinkPlanets(data.data.reels);
    });
  }

  get container() {
    return this._container;
  }

  init() {
    const bg = new Sprite(Assets.get("bg"));
    bg.setSize(850, 600);
    this._container.addChild(bg);
    this.drawPlanets();
    this.planetAction();
    this.timerAction(7);
  }

  drawPlanets() {
    const planetsCordsX = [40, 70, 140, 300, 280, 400, 600, 550, 680];
    const planetsCordsY = [90, 250, 400, 210, 50, 400, 420, 200, 70];
    for (let i = 1; i <= 9; i++) {
      const planet = new Sprite(Assets.get(`planet${i}`));
      planet.setSize(110, 100);
      planet.position.set(planetsCordsX[i - 1], planetsCordsY[i - 1]);
      planet.alpha = 0.4;
      this.planetArr.push(planet);
      this._container.addChild(planet);
    }
  }

  drawPoints(points: number = 0) {
    this.pointesText.text = `Points: ${points}`;
    this.pointesText.style = {
      fill: "white",
      fontWeight: "bolder",
    };
    this._container.addChild(this.pointesText);
  }

  drawHearts(hearts: number = 0) {
    this.heartsText.text = `Hearts: ${hearts}`;
    this.heartsText.style = {
      fill: "white",
      fontWeight: "bolder",
    };
    this.heartsText.position.set(0, 30);
    this._container.addChild(this.heartsText);
  }

  blinkPlanets(data: number[]) {
    if (data) {
      console.log("data :", data);
      const blinkDuration = 500;

      const blink = (index: number) => {
        if (index >= data.length) return;

        const planetIndex = data[index];
        console.log("planetIndex :", planetIndex);
        const planet = this.planetArr[planetIndex - 1];
        console.log("planet :", planet);

        planet.alpha = 1;
        setTimeout(() => {
          planet.alpha = 0.4;
          blink(index + 1);
        }, blinkDuration);
      };
      blink(1);
    }
  }

  planetAction() {
    this.planetArr.forEach((planet, index) => {
      planet.eventMode = "dynamic";
      planet.cursor = "pointer";
      planet.addEventListener("pointertap", () => {
        this.saveCollectPlanetIndex.push(index);
      });
    });
  }

  timerAction(time: number) {
    console.log(time);
    this.timer = setInterval(() => {
      time--;
      if (time <= 0) {
        clearInterval(this.timer);
        Socket.getInstance().sendAction({
          action: "SIMON_STEP",
          type: "action",
          data: this.saveCollectPlanetIndex,
        });
        time = 7;
      }
      this.timerText.text = `Time: ${time}`;
    }, 1000);
    this.timerText.style = {
      fill: "white",
      fontWeight: "bolder",
    };
    this.timerText.position.set(0, 60);
    this._container.addChild(this.timerText);
  }

  destroy() {
    this._container.destroy();
  }
}
