const main = document.querySelector('main');
const pageNav = document.querySelectorAll(".page-nav__day");
const dayNum = document.querySelectorAll('.page-nav__day-number');


document.addEventListener('DOMContentLoaded', () => {

    // корректные дни
    const week = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    let today = new Date();

    [...dayNum].forEach((elem, i) => {
        const day = new Date(today.getTime() + (1000 * 60 * 60 * 24 * i));
        elem.innerHTML = `${day.getDate()}`
        elem.previousElementSibling.innerHTML = week[day.getDay()];
        if (elem.previousElementSibling.textContent === 'Сб' || elem.previousElementSibling.textContent === 'Вс') {
            elem.classList.add('page-nav__day_weekend');
            elem.previousElementSibling.classList.add('page-nav__day_weekend');
        }
    });

    let midnight = (today.getHours() * 3600000) + (today.getMinutes() * 60000) + (today.getSeconds() * 1000) + today.getMilliseconds();
    let todayTime = today.getTime();

    // запрос с разметкой
    postResponse('https://jscp-diplom.netoserver.ru/', 'event=update')
    .then((data) => {
        let dataJson = JSON.stringify(data);

        let films = data.films.result;
        let seances = data.seances.result;
        let hallsOpen = data.halls.result.filter((hall) => hall.hall_open == 1);
    

        localStorage.setItem('info', dataJson)
        

        films.forEach(films => {
            let seancesHalls = '';

            hallsOpen.forEach((hall) => {
            const seancesCorrect = seances.filter((seance) => 
            ((seance.seance_hallid === hall.hall_id) && (seance.seance_filmid === films.film_id)));

                if (seancesCorrect.length > 0) {
                    seancesHalls += `
                    <div class="movie-seances__hall row">
                    <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
                    <ul class="movie-seances__list col-12">`
                    seancesCorrect.forEach((seance) => {
                        seancesHalls += `<li class="movie-seances__time-block">
                       <a class="movie-seances__time" href="hall.html"
                       data-film-name="${films.film_name}"
                       data-film-id="${films.film_id}"
                       data-hall-id="${hall.hall_id}"
                       data-hall-name="${hall.hall_name}"
                       data-price-vip="${hall.hall_price_vip}"
                       data-price-standart="${hall.hall_price_standart}"
                       data-seance-id="${seance.seance_id}" 
                       data-seance-start="${seance.seance_start}"
                       data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`;
                       });
                       seancesHalls += `
                       </ul>
                       </div>
                    `;
                };
            });

            if (seancesHalls) {
                main.innerHTML += `
        <section class="movie container-fluid">
          <div class="movie__info row justify-content-center">
           <div class="movie__poster col-4">
              <img class="movie__poster-image" alt="${films.film_name}" src="${films.film_poster}">
            </div>
            <div class="movie__description col-8"> 
              <h2 class="movie__title">${films.film_name}</h2>
              <p class="movie__synopsis">${films.film_description}</p>
              <p class="movie__data">
                <span class="movie__data-duration">${films.film_duration} минут |</span>
                <span class="movie__data-origin text-decoration-underline">${films.film_origin}</span>
              </p>
            </div>
          </div>
          ${seancesHalls}
          </section>
                      `
            }

            // работа с временем
            [...pageNav].forEach((elem, index) => {
                // let msUTC = today.getUTCMilliseconds();
                // console.log(msUTC)
                  let msUTC = +today + (index * 86400000) - midnight;
                  elem.dataset.dayTimestamp = Math.round(msUTC / 1000)
                  
                  elem.onclick = (event) => {
                      // переключатель
                        [...pageNav].forEach((item) => item.classList.remove('page-nav__day_chosen'));
                        if (!elem.parentElement.classList.contains('page-nav__day')) {
                            elem.classList.add('page-nav__day_chosen');
                        }
                    
                      const timestampDay = getTimestampDay(event);
                      updateSeances(timestampDay);

                  };
              });

              const movieSeances = document.querySelectorAll('.movie-seances__time');
              let updateSeances = (timestampDay) => {
                [...movieSeances].forEach((movieSeance) => {
                      const timestampSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
                      const timestampSeance = timestampDay + timestampSeanceDay;
                      const timestampNow = todayTime / 1000;
                      
                      movieSeance.dataset.seanceTimestamp = timestampSeance;
                    //movieSeance.classList.toggle("acceptin-button-disabled", timeStampSeance - timeStampNow <= 0);
                      (timestampSeance - timestampNow <= 0) ? movieSeance.classList.add('acceptin-button-disabled') : movieSeance.classList.remove('acceptin-button-disabled');
                  });
              }

              const getTimestampDay = (event) => {
                  let timestampDay = Number(event.target.dataset.dayTimestamp);
                  if (isNaN(timestampDay)) {
                      timestampDay = Number(event.target.closest(".page-nav__day").dataset.dayTimestamp);
                  }
                  return timestampDay;
              }
              pageNav[0].click();


              [...movieSeances].forEach((elem) => {
                  elem.addEventListener('click', event => {
                    let selectSeance = JSON.stringify(event.target.dataset);
                    sessionStorage.setItem('selectSeance', selectSeance)
                  })
              })
        });
    });
});

