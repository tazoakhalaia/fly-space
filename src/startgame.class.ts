import { Container, Graphics } from "pixi.js";

export class StartGame {
  private _container = new Container();
  private startContainer = new Container();
  private startActionBtn?: Graphics;
  private bg?: Graphics;

  get container() {
    this.init();
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
  }

  startBtn() {
    this.startActionBtn = new Graphics()
      .rect(200 / 2, 250 / 2 - 25, 200, 50)
      .fill({ color: "green" });
    this.startContainer.addChild(this.startActionBtn);
  }
}
