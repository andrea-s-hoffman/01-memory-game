"use strict";
// variables
let cardContainer = document.querySelector(".card-container");
let openCards = [];
let hiddenCards = [];
let startButton = document.querySelector(".start-button");
let popUpWindowEnd = document.querySelector(".end-popup");
let popUpWindowStart = document.querySelector(".start-popup");
let resetButton = document.querySelector(`.reset-button`);
let timer = document.querySelector(".timer");
let timerContainer = document.querySelector(".timer-container");
let endText = document.querySelector(".final-score");
let sec = 0;
let min = 0;
let hr = 0;

// array
let cards = [
  {
    source: "assets/theWhiteStripes-elephant.jpg",
    pair: "The White Stripes",
  },
  {
    source: "assets/vinyl-06.jpg",
    pair: "The White Stripes",
  },
  {
    source: "assets/theRaconteurs-brokenBoySoldiers.jpg",
    pair: "The Raconteurs",
  },
  {
    source: "assets/vinyl-02.jpg",
    pair: "The Raconteurs",
  },
  {
    source: "assets/theDeadWeather-dodgeAndBurn.jpg",
    pair: "The Dead Weather",
  },
  {
    source: "assets/vinyl-03.jpg",
    pair: "The Dead Weather",
  },
  {
    source: "assets/vinyl-04.jpg",
    pair: "The Upholsterers",
  },
  {
    source: "assets/upholsterers.jpg",
    pair: "The Upholsterers",
  },
  {
    source: "assets/jackWhite-lazaretto.jpg",
    pair: "Jack White",
  },
  {
    source: "assets/vinyl-01.jpg",
    pair: "Jack White",
  },
  {
    source: "assets/theGo-watchaDoin.jpg",
    pair: "The Go",
  },
  {
    source: "assets/vinyl-05.jpg",
    pair: "The Go",
  },
];

// start button event listener for disabling start popup and for starting timer
startButton.addEventListener("click", (event) => {
  event.preventDefault();
  startButton.classList.add("start-timer");
  popUpWindowStart.classList.add("disable-popup");
});

// shuffling & building deck
const randomizeCards = () => {
  let currentIndex = cards.length,
    temporaryValue,
    randomIndex;
  // While there are remaining cards to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining card...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current card.
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  cards.forEach((item) => {
    let cardParent = document.createElement("div");
    cardParent.classList.add(`flip-card`);
    let cardInner = document.createElement(`div`);
    cardInner.classList.add(`flip-card-inner`);
    let cardFront = document.createElement("div");
    cardFront.classList.add("flip-card-front");
    let frontImage = document.createElement("img");
    frontImage.classList.add(`front-image`);
    cardInner.setAttribute("data-pair", item.pair);
    frontImage.src = "assets/tmr-logo.jpg";
    let cardBack = document.createElement("div");
    cardBack.classList.add("flip-card-back");
    let backImage = document.createElement("img");
    backImage.classList.add("back-image");
    backImage.src = item.source;
    cardBack.append(backImage);
    cardFront.append(frontImage);
    cardInner.append(cardFront, cardBack);
    cardParent.append(cardInner);
    cardContainer.append(cardParent);
  });
};
randomizeCards();

// matching & unmatching game functionality
const flipCard = (e) => {
  if (e.target.classList.contains("flip-card-inner")) {
    e.target.classList.add(`clicked`);
    if (
      e.target.classList.contains("clicked") &&
      openCards.length <= 1 &&
      e.target !== openCards[0]
    ) {
      openCards.push(e.target);
    }
    if (openCards.length === 2) {
      cardContainer.removeEventListener("click", flipCard);
    }
    if (openCards.length === 2) {
      let firstCard = openCards[0].getAttribute(`data-pair`);
      let secondCard = openCards[1].getAttribute(`data-pair`);
      if (firstCard === secondCard) {
        hiddenCards.push(e.target);
        hiddenCards.push(e.target);
        matched();
      } else {
        setTimeout(() => {
          e.target.classList.add("unmatched");
          e.target.classList.remove("flip-card");
        }, 1500);
        unmatched();
      }
    }
    if (hiddenCards.length === 12) {
      setTimeout(() => {
        cardContainer.removeEventListener("click", flipCard);
        popUpWindowEnd.classList.add("trigger-popup");
        // line below to stop timer
        startButton.classList.remove("start-timer");
        // two lines below take final time and display at end popup
        let finalTime = timer.textContent;
        endText.textContent = `It took you ${finalTime} to finally make a conquest out of The Jack White Memory Game!`;
      }, 1500);
    }
  }
};
// when card is clicked, apply function above
cardContainer.addEventListener("click", flipCard);

// matched function that is pulled into flipCard function
let matched = () => {
  setTimeout(() => {
    openCards[0].classList.add(`hidden`);
    openCards[1].classList.add(`hidden`);
    cardContainer.addEventListener("click", flipCard);
    openCards = [];
  }, 1500);
};

// unmatched function that is pulled into flipCard function
let unmatched = () => {
  setTimeout(() => {
    openCards[0].classList.remove(`clicked`);
    openCards[1].classList.remove(`clicked`);
    cardContainer.addEventListener("click", flipCard);
    openCards = [];
  }, 1500);
};

// timer counting up
const gameTimer = () => {
  setInterval(() => {
    if (startButton.classList.contains(`start-timer`)) {
      sec++;
      sec = sec < 10 ? `0${sec}` : sec;
      timer.textContent = `0${min}:${sec}`;
      if (sec === 60) {
        sec = 0;
        min++;
      }
      if (min > 9) {
        timer.textContent = `${min}:${sec}`;
      }
      if (min === 60) {
        timer.innerHTML = `GIVE UP, <br> GET A LIFE!`;
        timer.style.fontSize = `14px`;
      }
    }
  }, 1000);
};
gameTimer();

// reset game and timer and reshuffle cards
let restartGame = () => {
  cardContainer.innerHTML = ``;
  randomizeCards();
  sec = 0;
  min = 0;
};
resetButton.addEventListener("click", restartGame);
