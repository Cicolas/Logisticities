import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import box from './BoxElement.html';

export default class BoxElement implements UIObject{
    name: string = "BoxElement";
    public html: string = box;
    public elem: HTMLElement;

    private frame: number = 0;
    private title: string = "";
    private text: string = "";

    constructor(title: string, text: string){
        this.title = title;
        this.text = text;
    }

    init(ui: UI, gameWin: GameController) {
        const title = this.elem.getElementsByClassName("$TITLE")[0];
        const text = this.elem.getElementsByClassName("$TEXT")[0];
        title.innerHTML = this.title;
        text.innerHTML = this.text;

        this.elem.addEventListener("click", () => {
            ui.destroyElement(this);
        });
    };

    update(gameWin: GameController) {};

    destroy() {
        this.elem.animate([
            { opacity: "0%" }
        ], {
            duration: 400
        })

        setTimeout(() => {
            this.elem.remove();
        }, 390)
    };
}