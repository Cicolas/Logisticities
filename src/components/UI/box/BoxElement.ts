import "./BoxElement.css";

import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import Suply, { SuplyInventory } from '../../../scripts/suply';
import { formatNumber, position } from '../../../scripts/utils';
import box from './BoxElement.html';
import { CityInterface } from "../../CityComponent";
import { Upgrade } from "../../../scripts/upgrades";

const DEFAULT_CONFIG = {
    isCity: false
}

export interface BoxElementOptions {
    isCity: boolean,
    city?: CityInterface,
    cityInvetory?: SuplyInventory[],
    upgrades?: Upgrade[]
}

export default class BoxElement implements UIObject{
    name: string = "BoxElement";
    public html: string = box;
    public elem: HTMLElement;
    public position: position = {x: -Infinity, y: -Infinity};

    private isToggled: boolean = false;
    private options: BoxElementOptions;
    private frame: number = 0;
    private title: string = "";
    private text: string = "";
    private suplies: [HTMLElement, Suply][] = [];

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
            text.classList.remove("hidden");
            up.className = up.className+" hidden"
            info.className = up.className+" hidden"
        }else {
            if (this.options.city.productionSuply) {
                for (let i = 0; i < this.options.city.productionSuply.length; i++) {
                    const element = this.options.city.productionSuply[i];

                    this.setSuply(element.need?needs: have, element)
                }
            }
            if (this.options.upgrades) {
                if (this.options.upgrades[0]) {
                    this.addUpgrade(this.options.upgrades);
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

        this.updateValues();
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

    updateValues() {
        if (this.options.isCity) {
            for (let i = 0; i < this.suplies.length; i++) {
                const element = this.suplies[i];
                const number = this.suplies[i][0].getElementsByClassName("$NUMBER")[0];
                if (!element[1].need) {
                    if (this.options.cityInvetory) {
                        number.innerHTML = formatNumber(this.options.cityInvetory.find(
                            (value) => element[1].id === value.id
                        ).quantity, 0, 0).toString();
                    }
                }else {
                    number.innerHTML = formatNumber((element[1].needNumber??0), 0, 0).toString();
                }
            }
        }
    }

    setSuply(div: Element, suply: Suply) {
        const d = document.createElement("div");
        d.classList.add("circle", "circle-24px");
        const html = `
            ${suply.emoji}
            <div class="$NUMBER">
            </div>
        `;
        d.innerHTML += html;
        div.appendChild(d);

        this.suplies.push([d, suply]);
    }

    public toggle() {
    }

    public addUpgrade(ups: Upgrade[]) {
        const up = this.elem.getElementsByClassName("$UPGRADE")[0];
        this.options.upgrades = ups;

        up.innerHTML = this.options.upgrades[0].emoji;
    }
}