import { CityInterface } from "../components/CityComponent";
import RoadComponent from "../components/RoadComponent";
import emojiMap from "./emojiMap";
import { getInRandomList } from "./utils";
import sup from './json/suplies.json';

var supliesTaken: [Suply, boolean][] = [];

var production: [CityInterface, Suply][] = [];
var needs: [CityInterface, Suply][] = [];

export default interface Suply {
    id: number;
    productionRate: number;
    name: string;
    emoji: string;
    need: boolean;
    needNumber?: number;
}

export interface SuplyInventory {
    id: number;
    quantity: number;
}

startSuplies();
function startSuplies() {
    sup.suplies.forEach(value => {
        const obj: Suply = {
            id: value.id,
            productionRate: 1,
            name: value.name,
            emoji: value.emoji,
            need: false
        }

        supliesTaken.push([obj, false]);
    });
}

export function startRandomSuply(city: CityInterface) {
    var s = getInRandomList<Suply>(supliesTaken);
    s[1] = true;

    const prodSup = {...s[0]};
    production.push([city, prodSup]);

    return prodSup;
}

export function resetSuply(){
    production = [];
    needs = [];

    for (let i = 0; i < supliesTaken.length; i++) {
        const c = supliesTaken[i];
        c[1] = false;
    }
}

export function getRandomNeed(city: CityInterface) {
    const needsList = production.filter(value => value[0].UUID !== city.UUID);

    const n = {...needsList[Math.floor(Math.random()*1000)%needsList.length][1]};
    n.need = true;
    const need: [CityInterface, Suply] = [city, n];

    needs.push(need)

    return need
}

export function addInventory(inv: SuplyInventory[], suply: SuplyInventory){
    const has = inv.find(value => value.id === suply.id);

    if (has) {
        has.quantity += suply.quantity;
    }else {
        inv.push(suply);
    }
}

export function getFromInventory(inv: SuplyInventory[], suply: Suply, cityToSend: CityInterface, capacity: number) {
    const index = inv.find(value => value.id === suply.id);
    const need = needs.find(value => {
        return (value[1].id === suply.id
        && value[0].UUID === cityToSend.UUID)
    })[1];

    var number = 0;

    if (need) {
        if (need.needNumber < index.quantity) {
            if (need.needNumber < capacity) {
                number = need.needNumber;
                index.quantity -= need.needNumber

            }else {
                number = capacity;
                index.quantity -= capacity;
            }
        }else if(need.needNumber >= index.quantity) {
            if (index.quantity < capacity) {
                number = index.quantity;
                index.quantity = 0;
            }else {
                number = capacity;
                index.quantity -= capacity
                console.log(capacity);
            }
        }
    }

    return number;
}

export function trainController(citySending: CityInterface): [CityInterface, RoadComponent, Suply][] {
    const sups = citySending.productionSuply.map((v) => {
        if (!v.need) {
            return v.id;
        }
        return -1;
    }).filter(value => value !== -1);

    var need = needs
        .filter(value => value[0].UUID !== citySending.UUID)
        .map(value => {
            const haveConection = value[0].roads.find(r => {
                if (r.cities[0].UUID === citySending.UUID ||
                    r.cities[1].UUID === citySending.UUID) {
                    return true
                }
                return false
            })

            if (haveConection) {
                return [value[0], haveConection, value[1]] as [CityInterface, RoadComponent, Suply]
            }else {
                return undefined
            }
        }).filter(value => value !== undefined).map(value => {
            const n = value[2].id; //need

            const congruent = sups.filter(s => n === s); //needs that the citySending has production

            if (congruent.length > 0) {
                return value;
            }
            return undefined
        }).filter(value => value !== undefined)

    return need
}