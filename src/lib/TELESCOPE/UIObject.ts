import GameController from "../../GameController";
import UI from "./UI";

export default interface UIObject {
    name: string;
    html?: string;
    elem?: HTMLElement

    init: (ui: UI, gameWin: GameController) => void;
    update?: (gameWin: GameController) => void;
    destroy?: () => void;
}

// TODO: SET AN OPTION FOR POSITIONING RELATIVE TO THE CANVAS SIZE FOR RESPOSIVITY
export interface UIConfig {
    position?: {x: number, y: number};
    size?: {x: number, y: number};
    time?: number;
}