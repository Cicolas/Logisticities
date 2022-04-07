import * as THREE from "three";
import { Camera, Vector2 } from "three";
import { DEBUG_INFO } from "../enviroment";
import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { cameraQuad, position } from "../scripts/utils";
import PlaneComponent from "./PlaneComponent";
import UpgradeElement from "./UI/upgradeSelection/UpgradeElement";
import UIManager from "./UIManager";

export default class UpgradeComponent implements ComponentInterface {
    name: string = "UpgradeComponent";

    private visible = true;
    private upgradeElem: UpgradeElement;
    private cards: HTMLCollection;

    constructor(ui: UIManager){
        this.upgradeElem = new UpgradeElement();

        ui.addElement(this.upgradeElem);
    }

    init(gameWin: GameWindow) {
        this.toggle();

        this.cards = this.upgradeElem.elem.getElementsByClassName("cards");

        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].addEventListener("click", this.checkClick.bind(this, i));
        }
    }
    update(obj: GObject, gameWin: GameWindow) {

    }
    draw (context?: THREE.Scene) {

    }

    public toggle() {
        this.visible = !this.visible;

        if (this.visible){
            this.upgradeElem.elem.classList.remove("hidden")
            this.getUpgrade();
        }
        else
            this.upgradeElem.elem.classList.add("hidden")
    }

    checkClick(n: number) {
        this.upgradeElem.click(n);
    }

    getUpgrade() {

    }
}