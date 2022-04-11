import * as THREE from "three";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { getUpgradeSet, Upgrade } from "../scripts/upgrades";
import GameManager from "./GameManager";
import UpgradeElement from "./UI/upgradeSelection/UpgradeElement";
import UIManager from "./UIManager";

export default class UpgradeComponent implements ComponentInterface {
    name: string = "UpgradeComponent";
    private gm: GameManager;

    private visible = true;
    private upgradeElem: UpgradeElement;
    private cards: HTMLCollection;

    private upgrades: Upgrade[];

    constructor(ui: UIManager){
        this.upgradeElem = new UpgradeElement();

        ui.addElement(this.upgradeElem);
    }

    init(gameWin: GameWindow) {
        this.cards = this.upgradeElem.elem.getElementsByClassName("cards");

        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].addEventListener("click", this.checkClick.bind(this, i));
        }
        this.toggle();

        setTimeout(this.postInit.bind(this, gameWin), 100);
    }
    postInit(gameWin: GameWindow) {
        this.gm = gameWin.getScene().getObject("gameManager")?.getComponent(GameManager) as GameManager;
    }

    update(obj: GObject, gameWin: GameWindow) {

    }
    draw (context?: THREE.Scene) {

    }

    public toggle() {
        this.visible = !this.visible;

        if (this.visible){
            this.upgradeElem.elem.classList.remove("hidden")
            this.getUpgrades();
        }
        else
            this.upgradeElem.elem.classList.add("hidden")
    }

    checkClick(n: number) {
        this.upgradeElem.click(n);

        this.gm.pickUpgrade(this.upgrades[n]);
    }

    getUpgrades() {
        this.upgrades = getUpgradeSet(3);

        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];

            const title = element.getElementsByClassName("$TITLE")[0];
            const upgrade = element.getElementsByClassName("$UPGRADE")[0];
            const text = element.getElementsByClassName("$TEXT")[0];

            title.innerHTML = this.upgrades[i].name;
            upgrade.innerHTML = this.upgrades[i].emoji;
            text.innerHTML = this.upgrades[i].description;
        }
    }
}