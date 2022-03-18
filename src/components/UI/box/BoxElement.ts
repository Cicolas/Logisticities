import "./BoxElement.css";

import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import emojiMap from '../../../scripts/emojiMap';
import Suply from '../../../scripts/suply';
import { position } from '../../../scripts/utils';
import RoadComponent from '../../RoadComponent';
import box from './BoxElement.html';
import { CityInterface } from "../../CityComponent";

const DEFAULT_CONFIG = {
    isCity: false
}

export interface BoxElementOptions {
    isCity: boolean,
    city?: CityInterface
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
        const info = this.elem.getElementsByClassName("info")[0];
        const have = this.elem.getElementsByClassName("$HAVE")[0];
        const needs = this.elem.getElementsByClassName("$NEEDS")[0];
        title.innerHTML = this.title;
        text.innerHTML = this.text;
        up.innerHTML = "";
        have.innerHTML = "";
        needs.innerHTML = "";

        if (!this.options.isCity) {
            up.className = up.className+" hidden"
            info.className = up.className+" hidden"
        }else {
            if (this.options.city.productionSuply) {
                for (let i = 0; i < this.options.city.productionSuply.length; i++) {
                    const element = this.options.city.productionSuply[i];

                    this.setSuply(element.need?needs: have, element)
                }
            }
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

    setSuply(div: Element, suply: Suply) {
        const html = `
            <div class="circle circle-24px">
                ${suply.emoji}
            </div>
        `
        div.innerHTML += html;
    }
}