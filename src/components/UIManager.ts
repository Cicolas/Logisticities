import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import UI from "../lib/TELESCOPE/UI";
import BoxElement from "./UI/box";

export default class UIManager implements ComponentInterface {
    name: string = "UIManager";

    public UI: UI;
    private width: number;
    private height: number;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
    }

    init(gameWin: GameController) {
        this.UI = new UI(gameWin.canvas, this.width, this.height, gameWin);

        this.UI.addElement(new BoxElement, {
            position: {x: this.width/2, y: this.height/2},
            size: {x: 300, y: 150}
        })
    }

    update(obj: GObject, gameWin: GameWindow) {}
    draw (context?: THREE.Scene) {};
}