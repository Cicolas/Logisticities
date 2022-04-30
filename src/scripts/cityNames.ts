import { getInRandomList } from "./utils/utils";

const cityNamesTaken: [string, boolean][] = [
    ["Roseira", false],
    ["Maryland", false],
    ["Annapolis", false],
    ["New Thomas", false],
]

export function getCityName(){
    var c = getInRandomList(cityNamesTaken);
    c[1] = true;

    return c[0];
}

export function resetCityName(){
    for (let i = 0; i < cityNamesTaken.length; i++) {
        const c = cityNamesTaken[i];
        c[1] = false;
    }
}