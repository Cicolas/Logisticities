// ,
//         {
//             "id": 5,
//             "name": "Quiet City",
//             "emoji": "&#x1F90D"
//         }
import ups from './json/upgrades.json';
import { getInRandomList } from './utils';

export interface Upgrade {
    id: number,
    name: string,
    emoji: string,
    description: string,
    consumable: boolean,
    productionBuff: number,
    needBuff: number,
    suply: number,
    speedBuff: number,
    trainBuff: number
}

export function getUpgradeSet(n: number) {
    const set = []

    const taken = []
    ups.upgrades.forEach(value => {
        taken.push([value, false]);
    })

    for (let i = 0; i < n; i++) {
        let s = getInRandomList<Upgrade>(taken);
        s[1] = true;

        set.push(s[0]);
    }

    return set;
}

