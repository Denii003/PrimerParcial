import { config } from '../js/config.js';

//post call
export async function postCall(phoneNumber) {
    //url
    var url = config.api.url + "call/receive/" + phoneNumber;
    console.log(url);
    //fetch
    return await fetch(url, { method: 'POST'} )
        .then( (result) => { return result.json(); })
        .catch( (error) => { console.error(error) })
}
//end call
export async function endCall() {
    //url
    var url = config.api.url + "call/end/";
    console.log(url);
    //fetch
    return await fetch(url, { method: 'POST'} )
        .then( (result) => { return result.json(); })
        .catch( (error) => { console.error(error) })
}
//get totals
export async function getTotals(date) {
    //url
    var url = config.api.url + "call/totals/" + date;
    console.log(url);
    //fetch
    return await fetch(url)
        .then( (result) => { return result.json(); })
        .catch( (error) => { console.error(error) })
}