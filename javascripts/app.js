

/*
 *
*/
function assignStars() {

}

function gameState(state) {
  switch (state) {
    case 'start': break; 
    case 'gameover': break; 
    case 'restart': break; 
      
  }
}

/*
 *  Decreases the timer by 1 second starting from 60 seconds
 *  by subtracting the current time from the time
 *  when the page is loaded
 *  @param  - Date, Date
 */
let timer;
function decreaseTimer(startTime, currentTime) {
  if (Math.floor((startTime - currentTime)/ 1000) >= 0) {
    let counter = Math.floor((startTime - currentTime)/ 1000);
    document.querySelector('.time').innerText = counter;
  }
}
function startTimer () {
  let startTime = Date.now() + (1000 * 31);
    timer = setInterval( () => {
    decreaseTimer(startTime, Date.now());
  }, 1000);

}
startTimer();

/* 
 * Creates a new audio object and generates
 * a bubble sound on card flip
 */
function playSound(type) {
  let audio = new Audio(`assets/sounds/${type}.wav`);
  audio.play();
}

/*
 *  Grabs data from a public JSON
 *  which is used for generating the content
 *  of the cards
 */
let numberOfCards;
function grabCardContentData() {
  const contentURL = 'https://api.myjson.com/bins/67kng'
  fetch(contentURL)
    .then(data => data.json())
    .then(response => {
      let cards = shuffle(response);
      numberOfCards = cards.length;
      generateCards(cards);
    })
}

/*
 *  Grabs data from assets folder 'assets/'
 *  which is used for generating the content
 *  of the cards
 */
function grabCardContent() {
  let cards = [];
    for (let i = 0; i < 8; i++) {
      let file = `assets/landscapes/${i+1}.png`;
      let type = `ng${i+1}`;
      let card = { 'image': file , 'type': type };
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
    let deck = document.querySelector('.deck');
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
 *  When number of initial cards is the same as the number
 *  of cards that the player matched in the game
 *  then turn on a game state for winning
 */
function gameWin() {
  console.log("congratulations motherfucker");
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
    gameWin();
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
function incrementMove() {
  moves++;
  let move;
  for (move of document.querySelectorAll('.moves')) {
    move.innerText = moves;
  } 
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
let moves = 0;
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
document.querySelector('.button').addEventListener('click', () => { resetGame() });
function resetGame() {
  moves = 0;
  document.querySelector('.moves').innerText = moves;
  openCards = [];
  matchedCards = [];
  while (_DECK.firstChild) {
    _DECK.firstChild.remove();
  }
  grabCardContentData();
  clearTimeout(timer);
  startTimer();
}