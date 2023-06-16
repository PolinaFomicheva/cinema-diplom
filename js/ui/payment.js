let localSeanse = JSON.parse(localStorage.getItem('seance'));
console.log(localSeanse);

document.addEventListener('DOMContentLoaded', () => {
    // шапка
    document.querySelector('.ticket__title').innerHTML = localSeanse.filmName;
    document.querySelector('.ticket__hall').innerHTML = localSeanse.hallName.slice(3, 4); 
    document.querySelector('.ticket__start').innerHTML = localSeanse.seanceTime; 
    document.querySelector('.ticket__title').innerHTML = localSeanse.filmName;
// места
    let place = [];
    for (item of localSeanse.salesPlaces) {
        place.push(' ' + item.row + '/' + item.places)
    }
    document.querySelector('.ticket__chairs').innerHTML = place;


    // итоговая цена
    let totalPrice = [];

    for (elem of localSeanse.salesPlaces) {
        let standart = [];
        let vip = [];
        if (elem.price === 'vip') {
            vip = localSeanse.priceVip;
        }
        if (elem.price === 'standart') {
            standart = localSeanse.priceStandart
        }
        totalPrice.push(Number(standart) + Number(vip))
    }
    

    let finishPrice = totalPrice.reduce((sum, elem) => {
        return sum + elem;
    }, 0);

    document.querySelector('.ticket__cost').innerHTML = finishPrice




// запрос
    postResponse('https://jscp-diplom.netoserver.ru/', `event=sale_add&timestamp=${localSeanse.seanceTimestamp}&hallId=${localSeanse.hallId}&seanceId=${localSeanse.seanceId}&hallConfiguration=${localSeanse.hallConfig}`)
        .then(() => {

        })

})

