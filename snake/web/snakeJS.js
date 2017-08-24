var canvasSize=500;
var pixelSize=20;
var snake;
var manzana;
var puntaje;
var comido;
var currSnake;
var snakes;
var alfa=0.01;
var bestSnakes;
var tableroPosciciones=24;
var vision= 24;
var inputsCant=30;
var movimientoContador;
var generation;
var hidden = [
  function(n){
    var suma=0;
    for (no of n){
      suma+=no;
    }
    return Math.sin(suma)
  },
  function(n){
    var suma=0;
    for (no of n){
      suma+=no;
    }
    return Math.cos(suma)
  },
  function(n){
    var mult=1;
    for (no of n){
      mult=mult*no;
    }
    return Math.cos(mult)
  },
  function(n){
    var mult=1;
    for (no of n){
      mult=mult*no;
    }
    return Math.sin(mult)
  }
]
var hiddenSecond = [
  function(n){
    var suma=0;
    for (no of n){
      suma+=no;
    }
    return (sigmoid(suma)-0.5)*2
  },
  function(n){
    var suma=0;
    for (no of n){
      suma+=no;
    }
    return (Math.atan(suma)/Math.PI*2)
  },
  function(n){
    var mult=1;
    for (no of n){
      mult=mult*no;
    }
    return (sigmoid(mult)-0.5)*2
  },
  function(n){
    var mult=1;
    for (no of n){
      mult=mult*no;
    }
    return (Math.atan(mult)/Math.PI*2)
  }
]
function initVars(){
  puntaje=0;
  currSnake=0;
  snakes=[0];
  bestSnakes=[{
    "puntaje":-1
  }];
  generation=0;
}

function snakeInit(){
  nextSnake();
  comido=0;
  puntaje=0;
  snakes[currSnake].puntaje=0;
  snake={
        "dire":1,
     "coordenadas":
    {
      "snakeHeadx":12,
      "snakeHeady":12
    },
    "tail":[{
        "x":15,
        "y":12
      },
      {
        "x":14,
        "y":12
      },
      {
        "x":13,
        "y":12
      }]
};

newApple();
}

function snakeMove(){
  movimientoContador++;
  var mov=think(see());
  snakeDirChange(mov);
  snakes[currSnake].puntaje+=0.01
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var posx=snake.coordenadas.snakeHeadx;
  var posy=snake.coordenadas.snakeHeady;
  snake.coordenadas.snakeHeadx +=(dirVector(snake.dire))[0];
  snake.coordenadas.snakeHeady +=(dirVector(snake.dire))[1];
  if (movimientoContador>=500) {
    console.log("murio por sin movimientos");
    snakeInit();
    ctx.fillStyle="#FFFFFF"
    ctx.fillRect(0,0,canvasSize,canvasSize);
    return;
  }
  if (snake.coordenadas.snakeHeadx<0||snake.coordenadas.snakeHeadx>tableroPosciciones || snake.coordenadas.snakeHeady<0 || snake.coordenadas.snakeHeady>tableroPosciciones) {
    console.log("murio por comio pared");
    snakeInit();
    ctx.fillStyle="#FFFFFF"
    ctx.fillRect(0,0,canvasSize,canvasSize);
    return;
  }
  if (snake.coordenadas.snakeHeadx==manzana.x && snake.coordenadas.snakeHeady==manzana.y){
    snakes[currSnake].puntaje++
    puntaje+=1;
    comido=1;
    newApple();
  }
  if (!comido) {
    ctx.fillStyle="#FFFFFF"
    ctx.fillRect(snake.tail[0].x*pixelSize,snake.tail[0].y*pixelSize,pixelSize,pixelSize);
    snake.tail.splice(0,1);
  }
  comido=0;
  for (colaCheck of snake.tail){
    if (snake.coordenadas.snakeHeadx==colaCheck.x && snake.coordenadas.snakeHeady==colaCheck.y){
      console.log("murio por comio cola");
      snakeInit();
      ctx.fillStyle="#FFFFFF"
      ctx.fillRect(0,0,canvasSize,canvasSize);
      return;
    }
  }
  var newCola={
    "x":posx,
    "y":posy
  };
  snake.tail.push(newCola);
  ctx.fillStyle="#FF0000";
  ctx.fillRect(manzana.x*pixelSize,manzana.y*pixelSize,pixelSize,pixelSize);
  ctx.fillStyle="#01DF01";
  ctx.fillRect(snake.coordenadas.snakeHeadx*20,snake.coordenadas.snakeHeady*20,20,20);
  ctx.fillStyle="#0B610B";
  ctx.fillRect(newCola.x*20,newCola.y*20,20,20);
}

function snakeDirChange(dir){
  var dir= snake.dire + dir;
  if (dir!=0) {
    movimientoContador+=2;
  }
  if (dir<0) {
      dir +=4
    }
  else if (dir>3) {
      dir +=-4
    }
snake.dire=dir;
}

function dirVector(dir){
  switch (dir) {
    case 0:
      return [-1,0]
      break;
    case 1:
      return [0,-1]
      break;
    case 2:
      return [1,0]
      break;
    case 3:
      return [0,1]
      break;
  }
}

function cambiarDireEvent(event){
  var key = event.keyCode;
  switch (key) {
    case 68:
      snakeDirChange(1);
      break;
    case 65:
      snakeDirChange(-1);
      break;
  }
}
function newApple(){
  movimientoContador=0;
  document.getElementById("display").innerHTML = puntaje;
  var iterar=1;
  while(iterar){
    manzana={
      "x":Math.floor(Math.random() * tableroPosciciones),
      "y":Math.floor(Math.random() * tableroPosciciones)
    }
    if (manzana.x!=snake.coordenadas.snakeHeadx || manzana.y!=snake.coordenadas.snakeHeady){
      for (cola of snake.tail){
        if (manzana.x==cola.x && manzana.y==cola.y){
          iterar=1;
          break;
        }
        else {
          iterar=0;
        }
      }
    }
  }
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle="#FF0000";
  ctx.fillRect(manzana.x*pixelSize,manzana.y*pixelSize,pixelSize,pixelSize);
}

function checkForTail(input){
  for (cola of snake.tail){
    if (2>snake.coordenadas.snakeHeadx-cola.x && snake.coordenadas.snakeHeadx-cola.x>-2 && 2>snake.coordenadas.snakeHeady-cola.y && snake.coordenadas.snakeHeady-cola.y>-2 ) {
      input[5*(2+cola.x-snake.coordenadas.snakeHeadx)+(2+cola.y-snake.coordenadas.snakeHeady)]=-1
    }
  }
  return input;
}


function checkForWall(input){
  if ((snake.coordenadas.snakeHeadx+2)>tableroPosciciones){
    for (var i=1;i<=5;i++){
      input[(i*5)-1]=-1
    }
    if ((snake.coordenadas.snakeHeadx+1)>tableroPosciciones){
      for (var i=1;i<=5;i++){
        input[(i*5)-2]=-1
      }
    }
  }
  else if ((snake.coordenadas.snakeHeadx-2)<0){
    for (var i=1;i<=5;i++){
      input[(i*5)]=-1
    }
    if ((snake.coordenadas.snakeHeadx-1)<0){
      for (var i=1;i<=5;i++){
        input[(i*5)+1]=-1
      }
    }
  }
  if ((snake.coordenadas.snakeHeady+2)>tableroPosciciones){
    for (var i=0;i<5;i++){
      input[i+20]=-1
    }
    if ((snake.coordenadas.snakeHeady+1)>tableroPosciciones){
      for (var i=0;i<5;i++){
        input[i+15]=-1
      }
    }
  }
  else if ((snake.coordenadas.snakeHeady-2)>0){
    for (var i=0;i<5;i++){
      input[i]=-1
    }
    if ((snake.coordenadas.snakeHeady-1)>0){
      for (var i=0;i<5;i++){
        input[i+5]=-1
      }
    }
  }
  return input;
}

function checkForApple(input){
  if (2>snake.coordenadas.snakeHeadx-manzana.x && snake.coordenadas.snakeHeadx-manzana.x>-2 && 2>snake.coordenadas.snakeHeady-manzana.y && snake.coordenadas.snakeHeady-manzana.y>-2 ){
    input[5*(2+manzana.x-snake.coordenadas.snakeHeadx)+(2+manzana.y-snake.coordenadas.snakeHeady)]=1;
  }
  return input;
}

function checkDir(input){
  for (var i = 27; i < input.length; i++) {
    input[i]=0;
  }
  input[27+snake.dire]=1;
  return input;
}
function checkMov(input){
  input[12]=(movimientoContador)/500
  return input;
}
function searchApple(input){
  input[25]=(snake.coordenadas.snakeHeadx-manzana.x)/24;
  input[26]=(snake.coordenadas.snakeHeady-manzana.y)/24;
  return input;
}
function see(){
  var input=[0];
  for (i=0;i<=inputsCant;i++){
    input[i]=0;
  };
  input=checkForApple(input);
  input=checkForWall(input);
  input=checkForTail(input);
  input=checkDir(input);
  input=searchApple(input);
  input=checkMov(input);
  return input;
}

function readOutput(n){
  var pro=0;
  for (no of n){
    pro+=no;
  }
  pro=pro/n.length;
  if (pro>0.2) {
    return 1;
  }
  else if (pro< -0.2) {
    return -1;
  }
  else if (pro<0.2 && pro> -0.2) {
    return 0;
  }
  return 0;
}

function newSnakesNeurons(cantSnake){
  for (var c=0;c<cantSnake;c++){
    snakes[c]={
      "inputToHidden":[[0]],
      "hiddenToHidden":[[0]],
      "hiddenToOutput":[0],
      "puntaje":0
    }
    var i=0;
    var inputToHidden=[[0]];
    var hiddenToHidden=[[0]];
    var j;
    var hiddenToOutput=[0];
    for (i=0;i<=inputsCant;i++){
      inputToHidden[i]=[0];
      for(j in hidden){
        inputToHidden[i][j]=Math.random()
      }
    }
    for (i in hidden) {
      hiddenToHidden[i]=[0]
      for (j in hiddenSecond){
        hiddenToHidden[i][j]=Math.random()
      }
    }
    for (i in hiddenSecond){
      hiddenToOutput[i]=Math.random()
    }
    snakes[c].inputToHidden=inputToHidden;
    snakes[c].hiddenToOutput=hiddenToOutput;
    snakes[c].hiddenToHidden=hiddenToHidden;
  }
}
function newSnakesNeuronsFromBest(cantSnake){
  console.log("bestSnake es:");
  console.log(bestSnakes);
  var max=snakes.length;
  for (var c=max;c<(cantSnake+max);c++){
    snakes[c]={
      "inputToHidden":[[0]],
      "hiddenToHidden":[[0]],
      "hiddenToOutput":[0],
      "puntaje":0
    }
    var i=0;
    var inputToHidden=[[0]];
    var j;
    var hiddenToOutput=[0];
    var hiddenToHidden=[[0]]
    for (i=0;i<=inputsCant;i++){
      inputToHidden[i]=[0];
      for(j in hidden){
        inputToHidden[i][j]=bestSnakes[Math.floor(Math.random()*(bestSnakes.length))].inputToHidden[i][j]+(Math.random()*alfa)
      }
    }
    for (i in hidden) {
      hiddenToHidden[i]=[0]
      for (j in hiddenSecond){
        hiddenToHidden[i][j]=bestSnakes[Math.floor(Math.random()*(bestSnakes.length))].hiddenToHidden[i][j]+(Math.random()*alfa)
      }
    }
    for (i in hiddenSecond){
      hiddenToOutput[i]=bestSnakes[Math.floor(Math.random()*(bestSnakes.length))].hiddenToOutput[i]+(Math.random()*alfa)
    }
    snakes[c].inputToHidden=inputToHidden;
    snakes[c].hiddenToHidden=hiddenToHidden;
    snakes[c].hiddenToOutput=hiddenToOutput;
  }
}
function think(input){
  var f;
  var i;
  var j;
  var arToHid=[0];
  var hidRes=[0];
  var hidResToHid=[0];
  var hidResSecond=[0];
  var hidToOut=[0];
  for(j in hiddenSecond){
    for (f in hidden){
      for (i=0;i<inputsCant;i++){
        arToHid[i]=input[i]*snakes[currSnake].inputToHidden[i][f];
      }
      hidRes[f]=hidden[f](arToHid);
      hidResToHid[f]=hidRes[f]*snakes[currSnake].hiddenToHidden[f][j];
    }
  hidResSecond[j]=hiddenSecond[j](hidResToHid);
  hidToOut[j]=hidResSecond[j]*snakes[currSnake].hiddenToOutput[j];
  }
  return readOutput(hidToOut);
}

function nextSnake(){
  console.log("puntaje:" + snakes[currSnake].puntaje);
  bestOne(snakes[currSnake]);
  currSnake++;
  if (currSnake>=snakes.length) {
    snakes=[0];
    newSnakesNeurons(20);
    newSnakesNeuronsFromBest(80);
    currSnake=0;
    generation++;
    console.log("generacion: " + generation);
  }
}
function bestOne(snakeAux){
  if(bestSnakes[0].puntaje<snakeAux.puntaje){
    console.log("puntaje dif: " + bestSnakes[0].puntaje + " "+ snakeAux.puntaje);
    console.log(snakeAux);
    bestSnakes.push(snakeAux);
    inToArrayOrdered();
    while(bestSnakes.length>7){
      bestSnakes.splice(0,1);
    }
  }
}
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}
function inToArrayOrdered(){
  console.log("pre sort");
  console.log(bestSnakes);
  bestSnakes.sort(function (a,b){
    return (a.puntaje-b.puntaje)
  });
  console.log("post sort");
  console.log(bestSnakes);
}
function loadBestOnes(bestSnakesObject){
  bestSnakes=bestSnakesObject;
}
