import "./UpgradeBarElement.css";

import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import upgrade from './UpgradeBarElement.html';
import { Upgrade } from "../../../scripts/upgrades";
import GameManager from "../../GameManager";
import BoxElement from "../box/BoxElement";
import { position } from "../../../scripts/utils/utils";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

export default class UpgradeBarElement implements UIObject{
    name: string = "UpgradeBarElement";
    private gm: GameManager;
    private gw: GameController;
    private ui: UI;
    public html: string = upgrade;
    public elem: HTMLElement;

    private upgrades: Upgrade[] = [];
    private infoBox: BoxElement = null;
    private rawMousePos: position = {x: 0, y: 0};

    constructor(){
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
        this.ui = ui;
        this.elem.style.bottom = `${32}px`;
        this.elem.style.left = `50%`;

        document.addEventListener("mousemove", this.getMousePosition.bind(this))

        setTimeout(this.postInit.bind(this, gameWin), 100);
    };

    postInit(gameWin: GameController) {
        this.gm = gameWin.getScene().getObject("gameManager")?.getComponent(GameManager) as GameManager;
    }

    update(gameWin: GameController) {
        if (this.infoBox) {
            this.infoBox.position = {x: this.rawMousePos.x, y: this.rawMousePos.y-100}
        }

        if (this.upgrades.length <= 0) {
            this.elem.classList.add("hidden")
            return;
        }
        this.elem.classList.remove("hidden");
    };

    public updateUpgrades(ups: Upgrade[]) {
        this.upgrades.length = 0;

        const upgradeList = this.elem.getElementsByClassName("$UPGRADE_LIST")[0];
        upgradeList.innerHTML = "";

        for (let i = 0; i < ups.length; i++) {
            const element = ups[i];
            this.addUpgrade(element);
        }
    }

    public addUpgrade(up: Upgrade) {
        this.upgrades.push(up);

        const upgradeList = this.elem.getElementsByClassName("$UPGRADE_LIST")[0];

        const div = document.createElement("div");
        div.classList.add("circle", "circle-32px", "cursor-pointer");
        div.innerHTML = up.emoji;

        div.addEventListener("click", this.upgradeClick.bind(this, this.upgrades.length-1));
        div.addEventListener("mousemove", this.updateBox.bind(this, this.upgrades.length-1));
        div.addEventListener("mouseleave", this.destroyBox.bind(this));

        upgradeList.appendChild(div);
    }

    private upgradeClick(n: number){
        this.destroyBox();
        this.gm.pickUpgrade(n);
        // console.log(n);
    }

    private updateBox(n: number) {
        if (this.infoBox) {
            return;
        }

        this.infoBox = new BoxElement(
            this.upgrades[n].name,
            this.upgrades[n].description
        );

        // console.log(this.infoBox);

        this.ui.addElement(this.infoBox, {
            position: {x: this.rawMousePos.x, y: this.rawMousePos.y-125},
        });
    }

    private destroyBox() {
        if (!this.infoBox) {
            return;
        }

        this.infoBox.destroy();
        this.infoBox = null;
    }
}