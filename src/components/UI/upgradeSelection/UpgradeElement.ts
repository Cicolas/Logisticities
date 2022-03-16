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
}