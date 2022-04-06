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

    constructor(percent: number = 0){
        this.progress = percent;
    }

    init(ui: UI, gameWin: GameController) {
        this.slider = this.elem.getElementsByClassName("$SLIDER")[0] as HTMLElement;
    };

    update(gameWin: GameController) {
        this.slider.style.width = (this.progress*100)+"%";
    };
}