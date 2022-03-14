const suplies: [Suply, boolean][] = [
    [{
        id: 0,
        productionRate: 1,
        name: "Power",
        quantity: 0,
        need: false
    }, false],
    [{
        id: 1,
        productionRate: 1,
        name: "Water",
        quantity: 0,
        need: false
    }, false],
    [{
        id: 2,
        productionRate: 1,
        name: "Goods",
        quantity: 0,
        need: false
    }, false],
    [{
        id: 3,
        productionRate: 1,
        name: "Industry",
        quantity: 0,
        need: false
    }, false],
    [{
        id: 4,
        productionRate: 1,
        name: "Persons",
        quantity: 0,
        need: false
    }, false],
]

const production: [string, Suply][] = []

export default interface Suply {
    id: number;
    productionRate: number;
    name: string;
    quantity: number;
    need: boolean;
}

export function startRandomSuply(cityName: string) {
    var s;
    do{
        s = suplies[Math.floor(Math.random()*1000)%suplies.length];
    }while(s[1])

    s[1] = true;

    const prodSup = {...s[0]};
    production.push([cityName, prodSup]);
    console.log(s[0]);

    return prodSup;
}

export function resetSuply(){
    for (let i = 0; i < suplies.length; i++) {
        const c = suplies[i];
        c[1] = false;
    }
}