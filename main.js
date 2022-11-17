const BASE_URL = `https://api.exchangerate.host/latest`; // Baza api url

// Default 'credentials' deyishkeni
let credentials = {
    base: "USD",
    symbols: "EUR",
    amount: 1,
    result: "right"
};

/**
 * @name getDataAndAdd
 * @params {base,symbols,amount,result} credentials 
 * @description 'credentials' Obyektini alır ichinde getData və addData funksiyasini chagirir 
 * @return void
 */
async function getDataAndAdd(credentials) {
    const data = await getData(credentials);
    addData({
        data: data.rates[credentials.symbols],
        result: credentials.result
    });
}

/**
 * @name getData
 * @params {base, symbols, amount} 
 * @description 'credentials' Obyektini alir ichinde fetch apiden istifade edir
 * @return json
 */
async function getData({
    base,
    symbols,
    amount
}) {
    const response = await fetch(BASE_URL + `?base=${base}&symbols=${symbols}&amount=${amount}`);
    return await response.json();
}

/**
 * @name change
 * @param e
 * @description event parametrini alir ve getDataAndAdd funksiyasini chagirir
 * @return json
 */
function change(e) {
    getDataAndAdd({
        ...credentials,
        amount: e.value
    })
}

/**
 * @name addData
 * @params {data, result}
 * @description data, result deyerlerini alir ve ve elementin deyerine elave edeir
 * @return void
 */
function addData({
    data,
    result
}) {
    document.getElementsByClassName(`valyutaValue_${result}`)[0].value = data ? Number(data).toFixed(2) : 1;
}

/**
 * @name changeCurrency
 * @param e
 * @return void
 */
function changeCurrency(e) {
    if (!e.target) { // e.target yoxdursa demeli window load olanda chagirir ve getDataAndAdd funksiyasina default credentialslari oturur
        getDataAndAdd(credentials);
    } else {
        if (e.target.checked) { // eks halda e.target var e.target.checked yoxlayiriq
            let direction = String(e.target.id).includes(1) ? "left" : "right"; // clickin hansi terefden oldugunu mmueyyen edirik
            let reverse = String(e.target.id).includes(1) ? "right" : "left"; // eks terefi mueyyen edirik
            [...document.getElementsByClassName(direction)].forEach(el => el.checked = false); // eyni terefden olar diger checkboxlarin isharesini gotururuk
            e.target.checked = true; // clicklenen checkboxun isharesini elave edirik
            // eger eks terefde check olunan checkbox varsa
            if ([...document.getElementsByClassName(`customRadio_input ${reverse}`)].filter(e => e.checked == true)[0]) {
                // credentials obyektine yeni deyerlerin elave edilmesi
                credentials['amount'] = document.getElementsByClassName(`valyutaValue_${direction}`)[0].value; // inputun deyerini goturub amount keysine elave edirik
                credentials['base'] = e.target.name; // baza valyutani elave edirik
                credentials['symbols'] = [...document.getElementsByClassName(`customRadio_input ${reverse}`)].filter(e => e.checked == true)[0].name; // chevrilecek valyutani elave edirik
                credentials['result'] = reverse; // resultu eks terefde gostermek uchun eksi elave edirik
                getDataAndAdd(credentials); // getDataAndAdd funksiyasini chagiririq
            }
        }
    }
}

window.onload = () => {// Sehife yuklendiyinde bu funksiya run olacaq
    [...document.getElementsByClassName("customRadio_input")].forEach(button => button.addEventListener("click", changeCurrency)); // checkboxlara click eventi elave edirik ve calback olaraq changeCurrency yaziriq
    changeCurrency({}); // default deyerlerin oturmasi ucun changeCurrency funskiyasini cagirib icine bos obyekt otururuk
}