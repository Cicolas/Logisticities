import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import { formatNumber, position } from '../../../scripts/utils/utils';
import box from './FloatingElement.html';

export default class FloatingElement implements UIObject{
    name: string = "FloatingElement";
    public gw: GameController;
    public html: string = box;
    public elem: HTMLElement;
    private rawMousePos: position = {x: 0, y: 0};
    private icon: string;

    constructor(icon: string){
        this.icon = icon
    }

    getMousePosition(e) {
        const bb = this.gw.canvas.getBoundingClientRect();
        const mx = e.clientX - bb.left;
        const my = e.clientY - bb.top;

        this.rawMousePos.x = e.clientX - bb.left;
        this.rawMousePos.y = e.clientY - bb.top;
    }

    init(ui: UI, gameWin: GameController) {
        this.gw = gameWin;
        document.addEventListener("mousemove", this.getMousePosition.bind(this));

        const icon = this.elem.getElementsByClassName("$ICON")[0];
        icon.innerHTML = this.icon;
    };

    update(gameWin: GameController) {
        this.elem.style.left = this.rawMousePos.x+"px";
        this.elem.style.top = this.rawMousePos.y+"px";
    };

    destroy() {
        this.elem.remove();
    };
}