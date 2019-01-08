let popup = document.querySelector('.pop-up');
let gameButton = document.querySelector('#game-button');
let deck = document.querySelector('.deck');
let time = document.querySelector('.time');
let moves = document.querySelectorAll('.moves');

updatePopUpContent('start');

/*
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function assignStars(gameState) {
  let timeStamp = time.innerText;
  let subtitle = document.querySelector('.subtitle');
  let starImage = document.createElement("IMG");
  starImage.src = "assets/score/star.png";
  let star2, star3 = starImage.cloneNode(true);
  let bananaImage = document.createElement("IMG");
  bananaImage.src = "assets/score/banana.png";
  if (timeStamp > 40) {
    subtitle.appendChild(starImage);
    subtitle.appendChild(star2);
    subtitle.appendChild(star3);
  } else if (timeStamp > 25 && timeStamp <= 40) {
    subtitle.appendChild(starImage);
    subtitle.appendChild(star2);
  } else if (timeStamp > 0 && timeStamp <= 25) {
    subtitle.appendChild(starImage);
  } else {
    subtitle.appendChild(bananaImage);
  }
}

/*
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function onGameStart() {
  gameButton.addEventListener('click', () => {
    clearInterval(timer);
    startTimer();
    deck.className = "deck hide-cover";
    popup.className = "pop-up hidden";
    newGame();
  });
}

/*
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function onGameEnd() {
  shouldStart = false;
  updatePopUpContent('gameover');
  deck.className = "deck";
  popup.className = "pop-up";
}

/*
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function onGameWin() {
  onGameEnd();
}

/*
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function updateGameState(state) {
  let gameState = {};
  switch (state) {
    case 'start':
      gameState = { 'title': 'Start Game', 'subtitle': 'Match the right backgrounds together', 'button': 'Start' };
      onGameStart();
      break;
    case 'gameover':
      gameState = { 'title': 'Game Over', 'subtitle': '', 'button': 'Restart' };
      assignStars(gameState);
      break;
    case 'restart':
      gameState = { 'title': 'Restart Game', 'subtitle': 'Are you sure you want to restart?', 'button': 'Restart' };
      break;
  }
  return gameState;
}

/*
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function updatePopUpContent(state) {
  for (let item of popup.childNodes) {
    if (item.className) {
      let gameState = updateGameState(state);
      if (item.className === 'title')
        item.innerText = gameState.title;
      if (item.className === 'subtitle')
        item.innerText = gameState.subtitle;
      if (item.className === 'button')
        item.innerText = gameState.button;
    }
  }
}

/*
 *  Decreases the timer by 1 second starting from 60 seconds
 *  by subtracting the current time from the time
 *  when the page is loaded
 *  @param  - Date, Date
 */
function decreaseTimer(startTime, currentTime) {
  if (Math.floor((startTime - currentTime) / 1000) >= 0) {
    let counter = Math.floor((startTime - currentTime) / 1000);
    time.innerText = counter;
    if (Math.floor((startTime - currentTime) / 1000) == 0) {
      onGameEnd();
    }
  }
}
let shouldStart = false;
let timer = 0;
function startTimer() {
  let startTime = Date.now() + (1000 * 61);
  timer = setInterval(() => {
    if (shouldStart) decreaseTimer(startTime, Date.now());
  }, 1000);
}

/* 
 * Creates a new audio object and generates
 * a bubble sound on card flip
 */
function playSound(type) {
  let audio = new Audio(`assets/sounds/${type}.wav`);
  audio.play();
}

/*
 *  Grabs data from assets folder 'assets/'
 *  which is used for generating the content
 *  of the cards
 */
let numberOfCards;

function grabCardContent() {
  let cards = [];
  for (let i = 0; i < 8; i++) {
    let file = `assets/landscapes/${i+1}.png`;
    let type = `ng${i+1}`;
    let card = { 'image': file, 'type': type };
    cards.push(card);
    cards.push(card);
  }
  cards = shuffle(cards);
  numberOfCards = cards.length;
  generateCards(cards);
}
grabCardContent();

/*
 *  Generates and displays the cards
 *  Creates HTML element for the cards and attaches
 *  these nodes into the DOM
 *  @param  - object
 */
function generateCards(cards) {
  try {
    let frag = document.createDocumentFragment();
    let id = 0;
    for (c of cards) {
      let card = document.createElement("LI");
      let content = document.createElement("DIV");
      let front = document.createElement("DIV");
      let back = document.createElement("DIV");
      let image = document.createElement("IMG");
      card.className = "card";
      content.className = "content";
      front.className = "front";
      back.className = "back";
      image.src = c.image;
      image.id = id;
      image.setAttribute('type', c.type);
      back.appendChild(image);
      content.append(back, front);
      card.appendChild(content);
      frag.appendChild(card);
      id++;
    }
    deck.appendChild(frag);
  } catch (err) { console.log(err) }
}

/*
 *  Shuffles the cards
 *  From http://stackoverflow.com/a/2450976
 *  @param  - array
 *  @return - array
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/*
 *  When cards do match
 *  then keep them open and mark that they are matched,
 *  add these cards to a list of matched cards,
 *  and empty the list of open cards 
 */
function cardsMatch(firstCard, secondCard) {
  firstCard.parentNode.className = "back matched";
  secondCard.parentNode.className = "back matched";
  playSound('correct');
  matchedCards.push(firstCard, secondCard);
  if (matchedCards.length === numberOfCards) {
    onGameWin();
  }
  openCards = [];
}

/*
 *  When cards do not match
 *  then flip them back again and empty
 *  the list of open cards
 */
function cardsNoMatch(firstCard, secondCard) {
  firstCard.parentNode.parentNode.className = "content";
  secondCard.parentNode.parentNode.className = "content";
  openCards = [];
}

/*
 *  Increments the number of moves
 *  a player has made everytime they
 *  try to match card together
 */
let playerMoves = 0;

function incrementMove() {
  playerMoves++;
  moves.innerText = playerMoves;
}

/*
 *  Adds a cicked card to a list
 *  that tracks the number of cards open and
 *  which cards are currently open so comparison
 *  can be made between the two cards
 *  @param  - object
 */
function addOpenCardtoList(card) {
  if (openCards.indexOf(card) === -1 && openCards.length < 2) {
    console.log("add to open cards");
    openCards.push(card);
  }
  if (openCards.length === 2) {
    let firstCard = openCards[0];
    let secondCard = openCards[openCards.length - 1];
    if (firstCard.getAttribute('type') === secondCard.getAttribute('type')) {
      cardsMatch(firstCard, secondCard);
      incrementMove();
    } else {
      cardsNoMatch(firstCard, secondCard);
      incrementMove();
    }
  }
}

/*
 *  Event listener for the whole deck of cards
 *  which checks for a click on an image
 *  and then calls a function that appends the card
 */
let _DECK = document.querySelector('.deck');
let openCards = [];
let matchedCards = [];
let cardToggle = false;
_DECK.addEventListener('click', (event) => {
  if (event.target !== event.currentTarget && event.target.nodeName === 'IMG') {
    let card = event.target;
    playSound('bubble');
    card.parentNode.parentNode.className = "content show";
    addOpenCardtoList(card);
  }
}, false);

/*
 *  Resets the game if the player wants to start
 *  over again in the game
 */
function newGame() {
  playerMoves = 0;
  openCards = [];
  matchedCards = [];
  moves.innerText = playerMoves;
  while (_DECK.firstChild) {
    _DECK.firstChild.remove();
  }
  shouldStart = true;
  grabCardContent();
  clearInterval(timer);
  startTimer();
}