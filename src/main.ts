import { Application, Assets } from "pixi.js";
import { manifest } from "./space.manifest";
import { SpaceGame } from "./space-game.class";

class Main {
  private appDiv = document.getElementById("app");
  private app = new Application();
  private spaceGame = new SpaceGame();

  constructor() {
    Assets.addBundle("assets", manifest);
  }

  init() {
    Assets.loadBundle(["assets"]).then(async () => {
      await this.app.init({
        width: 850,
        height: 600,
        backgroundColor: "black",
        backgroundAlpha: 0,
      });
      (globalThis as any).__PIXI_APP__ = this.app; 
      this.app.stage.addChild(this.spaceGame.container);
      this.appDiv?.appendChild(this.app.canvas);
    });
  }
}

const main = new Main();
main.init();
