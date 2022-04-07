import GameController from '../../../GameController';
import UI from '../../../lib/TELESCOPE/UI';
import UIObject from '../../../lib/TELESCOPE/UIObject';
import { position } from '../../../scripts/utils';
import box from './UpgradeElement.html';

export default class UpgradeElement implements UIObject{
    name: string = "UpgradeElement";
    public html: string = box;
    public elem: HTMLElement;

    constructor(){
    }

    init(ui: UI, gameWin: GameController) {
    };

    update(gameWin: GameController) {
    };

    destroy() {
    };

    click(n: number) {
        const c = this.elem.getElementsByClassName("cards")[n];

        c.animate(
            [
                { transform: "scale(110%)" },
                { transform: "scale(100%)" },
                { transform: "scale(110%)" },
            ],
            {
                duration: 200,
            }
        );
    }
}