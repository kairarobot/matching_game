let popup = document.querySelector('.pop-up');
let gameButton = document.querySelector('#game-button');
let deck = document.querySelector('.deck');
let time = document.querySelector('.time');
let moves = document.querySelector('.moves');

// starts up the game
updateGameState("start"); 

/*
 *  Assign stickers to the player based on
 *  how fast they completed the game
 */
function assignStickers() {
  let timeStamp = time.innerText;
  if (timeStamp > 40)
    createStickers("star", 3)
  else if (timeStamp > 25 && timeStamp <= 40)
    createStickers("star", 2)
  else if (timeStamp > 0 && timeStamp <= 25)
    createStickers("star", 1)
  else
    createStickers("banana", 1)
}

/*
 *  Helper method for assigning stickers
 *  which creates stickers
 *  @param  - String, Number
 */
function createStickers(type, amount) {
  let sticker = document.createElement("IMG");
  let subtitle = document.querySelector('.subtitle');
  if (type === "star")
    sticker.src = "assets/score/star.png";
  else
    sticker.src = "assets/score/banana.png";
  for (let i = 0; i < amount; i++) {
    subtitle.appendChild(sticker);
    if (i > 0)
      subtitle.appendChild(sticker.cloneNode(true));
  }
}

/*
 *  Setup method for on game start
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
 *  Setup method for on game end
 */
function onGameEnd() {
  clearInterval(timer);
  deck.className = "deck";
  popup.className = "pop-up";
  assignStickers();
}

/*
 *  Updates the game state of the game, this is called
 *  whenever a change is needed in the state
 *  @param  - String
 */
function updateGameState(state) {
  let gameState = { title: '', subtitle: '', button: '' };
  switch (state) {
    case 'start':
      gameState = {
        title: 'Start Game',
        subtitle: 'Match the right backgrounds together',
        button: 'Start'
      };
      updatePopUpContent(gameState);
      onGameStart();
      break;
    case 'gameover':
      gameState = {
        title: 'Game Over',
        subtitle: '',
        button: 'Restart'
      };
      updatePopUpContent(gameState);
      onGameEnd();
      break;
  }
}

/*
 *  Updates the content inside the pop-up which
 *  only appears on game start or game over
 *  @param  - Object
 */
function updatePopUpContent(gameState) {
  for (let item of popup.childNodes) {
    switch (item.className) {
      case 'title':
        item.innerText = gameState.title;
        break;
      case 'subtitle':
        item.innerText = gameState.subtitle;
        break;
      case 'button':
        item.innerText = gameState.button;
        break;
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
      updateGameState("gameover");
    }
  }
}
let timer = 0;
function startTimer() {
  let startTime = Date.now() + (1000 * 61);
  timer = setInterval(() => {
    decreaseTimer(startTime, Date.now());
  }, 1000);
}

/* 
 * Creates a new audio object and generates
 * a bubble sound on card flip
 *  @param  - String
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
    let image = `assets/landscapes/${i+1}.png`;
    let type = `ng${i+1}`;
    let card = { image, type };
    cards.push(card);
    cards.push(card);
  }
  cards = shuffle(cards);
  numberOfCards = cards.length;
  generateCards(cards);
}

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
      // Create the HTML elements
      let card = document.createElement("LI");
      let content = document.createElement("DIV");
      let front = document.createElement("DIV");
      let back = document.createElement("DIV");
      let image = document.createElement("IMG");

      // Attach attributes to HTML elements
      card.className = "card";
      content.className = "content";
      front.className = "front";
      back.className = "back";
      image.id = id;
      image.src = c.image;
      image.setAttribute('type', c.type);

      // Temporarily append HTML elements to a fragment
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
    updateGameState("gameover");
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
 *  Creates a new game if the player wants to start
 *  over again. This is activated in the beginning
 *  of the game and also at game over.
 */
function newGame() {
  playerMoves = 0;
  openCards = [];
  matchedCards = [];
  moves.innerText = playerMoves;
  while (_DECK.firstChild) {
    _DECK.firstChild.remove();
  }
  grabCardContent();
  clearInterval(timer);
  startTimer();
}