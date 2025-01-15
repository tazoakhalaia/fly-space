import { Container, Graphics, Text } from "pixi.js";
import { Socket } from "./socket.class";

export class StartGame {
  private _container = new Container();
  private startContainer = new Container();
  private startActionBtnC = new Container();
  private startActionBtn?: Graphics;
  private bg?: Graphics;

  get container() {
    return this._container;
  }

  init() {
    this.bg = new Graphics().rect(0, 0, 400, 250).fill({ color: "white" });
    this.bg.pivot.set(0.5);
    this.startContainer.position.set(
      850 / 2 - this.bg.width / 2,
      600 / 2 - this.bg.height / 2
    );
    this.startContainer.addChild(this.bg);
    this._container.addChild(this.startContainer);
    this.startBtn();
    this.startAction();
  }

  startBtn() {
    this.startActionBtnC.position.set(200 / 2, 250 / 2 - 25);
    this.startActionBtn = new Graphics()
      .rect(0, 0, 200, 50)
      .fill({ color: "green" });

    const startText = new Text({ text: "თამაშის დაწყება" });
    startText.style = {
      fill: "white",
      fontSize: 14,
      fontWeight: "bolder",
      lineHeight: 50,
    };

    startText.position.set(
      this.startActionBtn.width / 2 - startText.width / 2,
      this.startActionBtn.height / 2 - startText.height / 2
    );

    this.startActionBtnC.addChild(this.startActionBtn, startText);
    this.startContainer.addChild(this.startActionBtnC);
  }

  startAction() {
    const socket = Socket.getInstance();
    this.startActionBtnC.eventMode = "dynamic";
    this.startActionBtnC.cursor = "pointer";
    this.startActionBtnC.addEventListener("pointertap", () => {
      socket.sendAction({
        action: "SIMON_STEP",
        type: "action",
        process: "STEP",
        data: {
          playerReels: [1],
          multiplier: 1,
        },
      });
      this.destroy();
    });
  }

  destroy() {
    this._container.destroy();
  }
}
