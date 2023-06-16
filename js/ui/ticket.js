let localSeanse = JSON.parse(localStorage.getItem('seance'));
const buttonExit = document.getElementById('button-back')

document.addEventListener('DOMContentLoaded', () => {
    // шапка
    document.querySelector('.ticket__title').innerHTML = localSeanse.filmName;
    document.querySelector('.ticket__chairs').innerHTML = localSeanse.filmName;
    document.querySelector('.ticket__hall').innerHTML = localSeanse.hallName.slice(3, 4); 
    document.querySelector('.ticket__start').innerHTML = localSeanse.seanceTime;
    let place = [];
    for (item of localSeanse.salesPlaces) {
        place.push(' ' + item.row + '/' + item.places)
    }
    document.querySelector('.ticket__chairs').innerHTML = place; 

    buttonExit.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = "index.html";
        link.click();
        })

    let date = new Date(Number(localSeanse.seanceTimestamp * 1000));
    let dayQR = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
    let textQR = `
    Дата: ${dayQR};
    Начало сеанса: ${localSeanse.seanceTime};
    Название фильма: ${localSeanse.filmName};
    Зал: ${localSeanse.hallName.slice(3, 4)};
    Ряд/Место ${place};
    `


// qrcode
const qrcode = QRCreator(textQR, { image: "SVG" });
document.querySelector(".ticket__info-qr").append(qrcode.result);
})

