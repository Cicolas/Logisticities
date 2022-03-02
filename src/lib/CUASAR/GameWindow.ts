// deno-lint-ignore-file no-inferrable-types
import Scene from "./Scene";

export default class GameWindow {
    private _name: string = "";

    public isRunning: boolean = false;

    public get name() : string {
        return this._name;
    }

    public width: number = 0;
    public height: number = 0;

    private scene: Scene[] = [];

    constructor(name: string) {
        this._name = name;
    }

    public setResolution(width: number, height: number): GameWindow {
        this.width = width;
        this.height = height;
        return this;
    }

    public pushScene(scene: Scene): GameWindow {
        this.scene.push(scene);
        return this;
    }
    public getScene(): Scene {
        return this.scene[this.scene.length-1];
    }
    public popScene(): GameWindow {
        this.scene.pop();
        return this;
    }

    public initGame(): GameWindow {
        this.isRunning = true;
        this.scene[this.scene.length-1].initScene(this);
        return this;
    }

    public updateGame(): GameWindow {
        this.scene[this.scene.length-1].updateScene(this);
        return this;
    }

    public drawGame(scene: THREE.Scene): GameWindow {
        this.scene[this.scene.length-1].drawScene(scene);
        return this;
    }

    public updateNRender(scene: THREE.Scene): GameWindow {
        while(this.isRunning) {
            this.updateGame().drawGame(scene);
        }

        return this;
    }

    updateTHREE: () => void;

    public call(fun: (gameWin: GameWindow) => void): GameWindow {
        fun(this);
        return this;
    }
}