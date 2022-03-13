import UI from '../../lib/TELESCOPE/UI';
import UIObject from '../../lib/TELESCOPE/UIObject';
import box from './box.html';

export default class BoxElement implements UIObject{
    name: string = "BoxElement";
    html?: string = box;
    elem?: HTMLElement;

    init(ui: UI) {
        this.elem.addEventListener("click", () => {
            this.elem.animate([
                { transform: "translate(-50%, -50%) scale(110%)" },
            ], {
                duration: 400
            })
            ui.destroyElement(this.name);
        });
    };

    destroy() {
        this.elem.animate([
            { opacity: "0%" }
        ], {
            duration: 400
        })

        setTimeout(() => {
            this.elem.remove();
        }, 390)
    };
}