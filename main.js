const BASE_URL = `https://api.exchangerate.host/latest`;

let credentials = {
    base:"USD",
    symbols:"EUR",
    amount:1,
    result:"right"
};

[...document.getElementsByClassName("customRadio_input")].forEach(button => button.addEventListener("click",changeCurrency));

async function getDataAndAdd(credentials) {
    const data = await getData(credentials);
    addData({data:data.rates[credentials.symbols], result:credentials.result})
}

async function getData({ base, symbols, amount}){
    const response = await fetch(BASE_URL + `?base=${base}&symbols=${symbols}&amount=${amount}`);
    return await response.json();
}

function change(e) {
    getDataAndAdd({...credentials,amount:e.value})
}

function addData({data, result}) {
    document.getElementsByClassName(`valyutaValue_${result}`)[0].value = data ? Number(data).toFixed(2) : 1;
}

function changeCurrency(e){
    if (!e.target) {
        getDataAndAdd(credentials);
    }else {
        if (e.target.checked) {
            let direction = String(e.target.id).includes(1) ? "left" : "right";
            let reverse = String(e.target.id).includes(1) ? "right" : "left";
            [...document.getElementsByClassName(direction)].forEach(el => el.checked = false);     
            e.target.checked = true;
      
            if ([...document.getElementsByClassName(`customRadio_input ${reverse}`)].filter(e => e.checked == true)[0]) {
                credentials['amount'] = document.getElementsByClassName(`valyutaValue_${direction}`)[0].value;
                credentials['base'] = e.target.name;
                credentials['symbols'] = [...document.getElementsByClassName(`customRadio_input ${reverse}`)].filter(e => e.checked == true)[0].name;
                credentials['result'] = reverse;
                getDataAndAdd(credentials);
            } 
        } 
    }
    
}

window.onload = changeCurrency({});