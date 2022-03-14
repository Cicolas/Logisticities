import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GObject from "../lib/CUASAR/GObject";
import UI from "../lib/TELESCOPE/UI";
import UIObject, { UIConfig } from "../lib/TELESCOPE/UIObject";

export default class UIManager implements ComponentInterface {
    name: string = "UIManager";

    public UI: UI;
    private width: number;
    private height: number;

    constructor(width: number, height: number, UI?: UI){
        this.width = width;
        this.height = height;

        if (UI) this.UI = UI;
    }

    init(gameWin: GameController) {
        if (!this.UI)
            this.UI = new UI(gameWin.canvas, this.width, this.height, gameWin);
    }

    update(obj: GObject, gameWin: GameController) {
        this.UI.uiElementList.forEach(value => {
            if (value.update) {
                value.update(gameWin);
            }
        })
    }
    draw (context?: THREE.Scene) {};

    addElement(elem: UIObject, opt?: UIConfig): UIManager {
        this.UI.addElement(elem, opt);

        return this;
    }
}