import { DEBUG_INFO } from "../../enviroment";
import GameController from "../../GameController";
import UIObject, { UIConfig } from "./UIObject";

export default class UI {
    private gw: GameController;
    public canvas: HTMLElement;
    private boundingBox: DOMRect;
    private div: HTMLElement;
    private width: number;
    private height: number;

    public uiElementList: UIObject[] = [];

    constructor(canvas: HTMLElement, width: number, height: number, gameWin: GameController) {
        this.canvas = canvas;
        this.boundingBox = canvas.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.gw = gameWin;
        this.start();

        document.body.appendChild(this.div);
    }

    start() {
        const div = document.createElement("div");
        div.id = "UI";
        div.style.position = "absolute";
        div.style.width = this.width+"px";
        div.style.height = this.height+"px";
        div.style.left = this.boundingBox.x+(DEBUG_INFO.camera.dontChangeSize?-8:0)+"px";
        div.style.top = this.boundingBox.y+(DEBUG_INFO.camera.dontChangeSize?-8:0)+"px";
        div.style.zIndex = "99";
        this.div = div;
    }

    addElement(elem: UIObject, opt?: UIConfig): UI {
        this.uiElementList.push(elem);

        if (elem.html) {
            const div = document.createElement("div")
            div.className = elem.name;
            div.innerHTML = elem.html;
            div.style.position = "absolute";

            if (opt) {
                if (opt.position) {
                    div.style.left = opt.position.x+"px";
                    div.style.top = opt.position.y+"px";
                }
                if (opt.size) {
                    div.style.width = opt.size.x+"px";
                    div.style.height = opt.size.y+"px";
                }
                if (opt.time) {
                    setTimeout(() => {
                        this.destroyElement(elem)
                    }, opt.time)
                }
            }

            elem.elem = div;
            elem.init(this, this.gw);

            this.div.appendChild(elem.elem);
        }

        return this;
    }

    public getElement(t: string): Object | undefined {
        return this.uiElementList.find(value =>
            value.name === t
        );
    }

    public destroyElement(t: UIObject): Object | undefined {
        if (t.destroy) {
            t.destroy();
        }else {
            t.elem.remove();
        }
        return this.uiElementList.filter(value =>
            value !== t
        );
    }

    public resize(w, h) {
        this.width = w;
        this.height = h;

        this.div.style.width = this.width+"px";
        this.div.style.height = this.height+"px";
        this.div.style.left = this.boundingBox.x+"px";
        this.div.style.top = this.boundingBox.y+"px";

        // this.canvas.
    }
}