
let seanceObject = JSON.parse(sessionStorage.getItem('selectSeance'));
let localObject = JSON.parse(localStorage.getItem('info'));
const button = document.querySelector('.acceptin-button');
const buttonExit = document.getElementById('button-back')


document.addEventListener('DOMContentLoaded', () => {

document.querySelector('.buying__info-title').innerHTML = seanceObject.filmName;
document.querySelector('.buying__info-start').innerHTML = 'Начало сеанса: ' + seanceObject.seanceTime;
document.querySelector('.buying__info-hall').innerHTML = seanceObject.hallName;
document.querySelector('.price-standart').innerHTML = seanceObject.priceStandart;
document.querySelector('.price-vip').innerHTML = seanceObject.priceVip;

// места
let hallConfig = '';
let localHalls = localObject.halls.result
for (item of localHalls) {
  if (item.hall_id === seanceObject.hallId) {
    hallConfig += item.hall_config
  }
}

  // отправка запроса
    postResponse('https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${seanceObject.seanceTimestamp}&hallId=${seanceObject.hallId}&seanceId=${seanceObject.seanceId}`)
    .then((data) => {
      if (data === null) {
        document.querySelector('.conf-step__wrapper').innerHTML = hallConfig
    } else {
        document.querySelector('.conf-step__wrapper').innerHTML = data
    }

// выбор места
const rows = document.querySelectorAll('.conf-step__row');
button.setAttribute("disabled", 'true')
let chairSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
for (item of rows) {
  item.onclick = function(event) {

      let span = event.target.closest('span'); 
      let spanStandart = span.classList.contains('conf-step__chair_standart');
      let spanVip = span.classList.contains('conf-step__chair_vip');

      if (spanStandart == false && spanVip == false) return; 
      span.classList.toggle('conf-step__chair_selected')
      chairSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
      
      // работа с кнопкой 
      chairSelected.length ? button.removeAttribute("disabled") : button.setAttribute("disabled", 'true');
    };
  }

 button.addEventListener('click', event => {
  event.preventDefault();
  let chosenPlace = Array();
  const rowsArray = Array.from(document.getElementsByClassName("conf-step__row"));
  for (elem of rowsArray) {
    const places = Array.from(elem.getElementsByClassName("conf-step__chair"));
    for (item of places) {
        if (item.classList.contains("conf-step__chair_selected")) {
            item.classList.replace('conf-step__chair_selected', 'conf-step__chair_taken')
            const chosenChairs = item.classList.contains("conf-step__chair_standart") ? 'standart' : 'vip'
            chosenPlace.push({
              'price': chosenChairs,
              'row':  (rowsArray.findIndex(row => row === elem)) + 1,
              'places': (places.findIndex(place => place === item)) + 1,
            })
        }
    }
}
const thisConfig = document.querySelector('.conf-step__wrapper').innerHTML;
seanceObject.hallConfig = thisConfig;
seanceObject.salesPlaces = chosenPlace;
localStorage.setItem('seance', JSON.stringify(seanceObject));
const link = document.createElement('a');
link.href = "payment.html";
link.click();
 })
})

buttonExit.addEventListener('click', () => {
const link = document.createElement('a');
link.href = "index.html";
link.click();
})

})


console.log(seanceObject)

