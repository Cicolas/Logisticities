// deno-lint-ignore-file no-inferrable-types
import ComponentInterface from "./Component";
import GameWindow from "./GameWindow";

export default class GObject {
    private _name: string = "";

    public get name() : string {
        return this._name;
    }


    private components: ComponentInterface[] = [];

    constructor(name: string) {
        this._name = name;
    }

    public addComponent(...components: ComponentInterface[]): GObject{
        components.forEach(value => {
            this.components.push(value);
        });
        return this;
    }

    public initObject(gameWin: GameWindow): GObject {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].init(gameWin);
        }
        return this;
    }

    public updateObject(gameWin: GameWindow): GObject {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update(this, gameWin);
        }
        return this;
    }

    public drawObject(scene: THREE.Scene): GObject {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].draw(scene);
        }
        return this;
    }

    // deno-lint-ignore ban-types
    public getComponent(t: Function): Object | undefined {
        return this.components.find(value =>
            // deno-lint-ignore ban-types
            (value as Object).constructor.name === t.name
        );
    }
}