import BLOCKS from "./block.js";

const playground = document.querySelector('.playground > ul');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');



// setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

let score = 0;
let durantion =500;
let downInterval;
let tempMovingItem;



const movingItem = {
  type : "",
  direction : 3,
  top:0,
  left:0,
}

// functions
function init(){
  tempMovingItem = { ...movingItem };
  for(let i = 0; i < GAME_ROWS; i++){
    prependNewLine();
  }
  generateNewBlock();
}

function prependNewLine(){
  const li = document.createElement('li');
  const ul = document.createElement('ul');
  for(let j = 0 ; j < GAME_COLS; j++){
    const matrix = document.createElement('li');
    ul.prepend(matrix);
  }
  li.prepend(ul)
  playground.prepend(li);
}


function renderBlocks(moveType){
  const {type , direction , top , left} = tempMovingItem;
  const movingBlocks = document.querySelectorAll('.moving');
  movingBlocks.forEach(item=>{
    item.classList.remove(type,"moving");
  })
  BLOCKS[type][direction].some(block=>{
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x]:null;
    const isAv = checkEmpty(target)
    if(isAv){
      target.classList.add(type,"moving");
    }else{
      tempMovingItem = {...movingItem};
      if(moveType === "retry"){
        clearInterval(downInterval);
        showGameoverText();
      }
      setTimeout(()=>{
        renderBlocks();
        if(moveType === "top"){
          seizeBlock();
        }
      },0)
      return true;
    }
  })
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}
function seizeBlock(){
  const movingBlocks = document.querySelectorAll('.moving');
  movingBlocks.forEach(item=>{
    item.classList.remove("moving");
    item.classList.add("seized");
  })
  chkMatch();
}

function chkMatch(){

  const childNodes = playground.childNodes;
  childNodes.forEach(item=>{
    let matched = true;
    item.children[0].childNodes.forEach(li=>{
      if(!li.classList.contains('seized')){
        matched = false;
      }
    })
    if(matched){
      item.remove();
      prependNewLine();
    }
  })

  generateNewBlock();
}

function generateNewBlock(){

  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock('top',1)
  },durantion)

  const blocksArray = Object.entries(BLOCKS);
  const randomIndex = Math.floor(Math.random()*blocksArray.length)

  movingItem.type=  blocksArray[randomIndex][0];
  movingItem.top =0;
  movingItem.left=3;
  movingItem.direction=0;
  tempMovingItem = {...movingItem};
  renderBlocks();
}

function checkEmpty(target){
  if(!target || target.classList.contains(".seized")){
    return false;
  }
  return true;
}

function moveBlock(moveType,amount){
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

function changeDirection(){
  const direction = tempMovingItem.direction;
  direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction+=1;
  renderBlocks();
}

function dropBlock(){
  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock('top',1)
  },10)
}

function showGameoverText(){
  gameText.style=display="flex";
}

document.addEventListener("keydown",(e)=>{
  switch(e.keyCode){
    case 39:
      moveBlock("left",1);
      break;
    case 37:
      moveBlock("left",-1);
      break;
    case 40:
      moveBlock("top",1);
      break;  
    case 38:
      changeDirection();
      break
    case 32:
      dropBlock();  
    default:
      break;  
  }
})


init();