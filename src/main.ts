import { Application, Assets } from "pixi.js";
import { manifest } from "./space.manifest";
import { SpaceGame } from "./space-game.class";
import { StartGame } from "./startgame.class";
import { Socket } from "./socket.class";

class Main {
  private appDiv = document.getElementById("app");
  private app = new Application();
  private spaceGame = new SpaceGame();
  private startGame = new StartGame();

  constructor() {
    Assets.addBundle("assets", manifest);
    window.addEventListener("resize", this.onResize.bind(this));
  }

  init() {
    Assets.loadBundle(["assets"]).then(async () => {
      await this.app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "black",
        backgroundAlpha: 0,
      });
      (globalThis as any).__PIXI_APP__ = this.app;
      this.startGame.init();
      this.spaceGame.init();
      this.app.stage.addChild(
        this.spaceGame.container,
        this.startGame.container
      );
      this.appDiv?.appendChild(this.app.canvas);
      this.onResize();
      const socket = Socket.getInstance();
      socket.connectWebSocket();
    });
  }

  onResize() {
    const scaleX = window.innerWidth / 850;
    const scaleY = window.innerHeight / 600;
    const scale = Math.min(scaleX, scaleY);

    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    if (window.innerWidth < 850 || window.innerHeight < 600) {
      this.spaceGame.container.scale.set(scale);
      this.spaceGame.container.position.set(
        (window.innerWidth - 850 * scale) / 2,
        (window.innerHeight - 600 * scale) / 2
      );

      this.startGame.container.scale.set(scale);
      this.startGame.container.position.set(
        (window.innerWidth - 850 * scale) / 2,
        (window.innerHeight - 600 * scale) / 2
      );
    } else {
      this.spaceGame.container.scale.set(1);
      this.spaceGame.container.position.set(
        (window.innerWidth - 850) / 2,
        (window.innerHeight - 600) / 2
      );

      this.startGame.container.scale.set(1);
      this.startGame.container.position.set(
        (window.innerWidth - 850) / 2,
        (window.innerHeight - 600) / 2
      );
    }
  }
}

const main = new Main();
main.init();
