import emojiMap from "./emojiMap";
import { getInRandomList } from "./utils";

const suplies: [Suply, boolean][] = [
    [{
        id: 0,
        productionRate: 1,
        name: "Power",
        emoji: emojiMap.power,
        quantity: 0,
        need: false
    }, false],
    [{
        id: 1,
        productionRate: 1,
        name: "Water",
        emoji: emojiMap.water,
        quantity: 0,
        need: false
    }, false],
    [{
        id: 2,
        productionRate: 1,
        name: "Goods",
        emoji: emojiMap.goods,
        quantity: 0,
        need: false
    }, false],
    [{
        id: 3,
        productionRate: 1,
        name: "Industry",
        emoji: emojiMap.industry,
        quantity: 0,
        need: false
    }, false],
    [{
        id: 4,
        productionRate: 1,
        name: "Persons",
        emoji: emojiMap.persons,
        quantity: 0,
        need: false
    }, false],
]

var production: [string, Suply][] = []

export default interface Suply {
    id: number;
    productionRate: number;
    name: string;
    emoji: string;
    quantity: number;
    need: boolean;
}

export function startRandomSuply(cityName: string) {
    var s = getInRandomList<Suply>(suplies);
    s[1] = true;

    const prodSup = {...s[0]};
    production.push([cityName, prodSup]);
    // console.log(s[0]);

    return prodSup;
}

export function resetSuply(){
    production = [];

    for (let i = 0; i < suplies.length; i++) {
        const c = suplies[i];
        c[1] = false;
    }
}

export function getRandomNeed(cityName: string) {
    const needsList = production.filter(value => value[0] !== cityName);

    console.log(production);

    return needsList[Math.floor(Math.random()*1000)%needsList.length];
}