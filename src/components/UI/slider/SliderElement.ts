import "./SliderElement.css";

import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import { formatNumber, position } from '../../../scripts/utils';
import box from './SliderElement.html';

export default class SliderElement implements UIObject{
    name: string = "SliderElement";
    public html: string = box;
    public elem: HTMLElement;
    public progress: number;

    private slider: HTMLElement;
    //TODO: CREATE AN INTERFACE
    private opt: any;

    constructor(percent: number = 0, opt: any){
        this.progress = percent;
        this.opt = opt;
    }

    init(ui: UI, gameWin: GameController) {
        this.slider = this.elem.getElementsByClassName("$SLIDER")[0] as HTMLElement;

        if (this.opt) {
            if (this.opt.isGUI) {
                this.elem.style.bottom = `${15}px`;
                this.elem.style.left = `50%`;
                this.elem.style.transform = "translate(-50%, 0)";
            }
        }
    };

    update(gameWin: GameController) {
        this.slider.style.width = (this.progress*100)+"%";
    };
}