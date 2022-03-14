import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import { position } from '../../../scripts/utils';
import box from './BoxElement.html';

const DEFAULT_CONFIG = {
    isCity: false
}

export interface BoxElementOptions {
    isCity: boolean
}

export default class BoxElement implements UIObject{
    name: string = "BoxElement";
    public html: string = box;
    public elem: HTMLElement;
    public position: position = {x: -Infinity, y: -Infinity};

    private options: BoxElementOptions;
    private frame: number = 0;
    private title: string = "";
    private text: string = "";

    constructor(title: string, text: string, option: BoxElementOptions = DEFAULT_CONFIG){
        this.title = title;
        this.text = text;
        this.options = option;
    }

    init(ui: UI, gameWin: GameController) {
        const title = this.elem.getElementsByClassName("$TITLE")[0];
        const text = this.elem.getElementsByClassName("$TEXT")[0];
        const up = this.elem.getElementsByClassName("$UPGRADE")[0];
        title.innerHTML = this.title;
        text.innerHTML = this.text;
        up.innerHTML = "";

        if (!this.options.isCity) {
            up.className = up.className+" hidden"
            console.log(up);

        }

        this.elem.addEventListener("click", () => {
            ui.destroyElement(this);
        });
    };

    update(gameWin: GameController) {
        this.elem.style.left = this.position.x+"px";
        this.elem.style.top = this.position.y+"px";
    };

    destroy() {
        this.elem.animate([
            { opacity: "0%" }
        ], {
            duration: 100
        })

        setTimeout(() => {
            this.elem.remove();
        }, 90)
    };
}