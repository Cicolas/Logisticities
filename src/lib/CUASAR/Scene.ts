// deno-lint-ignore-file no-inferrable-types
import GameWindow from "./GameWindow";
import GObject from "./GObject";

export default class Scene {
    public name: string = "";

    private objects: GObject[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public addObject(obj: GObject): Scene {
        // obj.forEach(value => {
        //     this.objects.push(value);
        // });
        this.objects.push(obj);
        return this;
    }
    public getObject(name: string): GObject {
        return this.objects.find(value =>
            // deno-lint-ignore ban-types
            value.name === name
        );
    }

    public initScene(gameWin: GameWindow): Scene {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].initObject(gameWin);
        }
        return this;
    }

    public updateScene(gameWin: GameWindow): Scene {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].updateObject(gameWin);
        }
        return this;
    }

    public drawScene(scene: THREE.Scene): Scene {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].drawObject(scene);
        }
        return this;
    }
}
