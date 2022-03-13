const cityNames: [string, boolean][] = [
    ["Roseira", false],
    ["Maryland", false],
    ["Annapolis", false],
    ["New Thomas", false],
]

export function getCityName(){
    var c = cityNames[Math.round(Math.random()*100)%cityNames.length];
    while (c[1]) {
        c = cityNames[Math.round(Math.random()*100)%cityNames.length];
    }
    c[1] = true;

    return c[0];
}

export function resetCityName(){
    for (let i = 0; i < cityNames.length; i++) {
        const c = cityNames[i];
        c[1] = false;
    }
}