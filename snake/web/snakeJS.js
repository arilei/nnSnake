var canvasSize=500;
var pixelSize=20;
var snake;
var manzana;
var puntaje;
var comido;
var currSnake=0;
var snakes=[0];
var alfa=0.15;
var bestSnake={
  "puntaje":-1
};
var tableroPosciciones=24;
var vision= 24;
var inputsCant=26;
var movimientoContador;
var generation=0;
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
  },
]

function snakeInit(){
  nextSnake();
  comido=0;
  puntaje=0;
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
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var posx=snake.coordenadas.snakeHeadx;
  var posy=snake.coordenadas.snakeHeady;
  snake.coordenadas.snakeHeadx +=(dirVector(snake.dire))[0];
  snake.coordenadas.snakeHeady +=(dirVector(snake.dire))[1];
  if (snake.coordenadas.snakeHeadx<0||snake.coordenadas.snakeHeadx>tableroPosciciones || snake.coordenadas.snakeHeady<0 || snake.coordenadas.snakeHeady>tableroPosciciones|| movimientoContador>=400) {
    bestOne();
    snakeInit();
    ctx.fillStyle="#FFFFFF"
    ctx.fillRect(0,0,canvasSize,canvasSize);
    return;
  }
  if (snake.coordenadas.snakeHeadx==manzana.x && snake.coordenadas.snakeHeady==manzana.y){
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
      bestOne();
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
    movimientoContador++;
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
  input[12]=(snake.dire+1)/4
  return input;
}
function searchApple(input){
  input[25]=snake.coordenadas.snakeHeadx-manzana.x;
  input[25]=snake.coordenadas.snakeHeady-manzana.y;
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
  return input;
}






function readOutput(n){
  var pro=0;
  for (no of n){
    pro+=no;
  }
  pro=pro/n.length;
  if (pro>0.3) {
    return 1;
  }
  else if (pro< -0.3) {
    return -1;
  }
  else if (pro<0.3 && pro> -0.3) {
    return 0;
  }
  console.log("error, promedio"+ pro);
  console.log(n);
  return 0;
}

function newSnakesNeurons(cantSnake){
  for (var c=0;c<cantSnake;c++){
    snakes[c]={
      "inputToHidden":[[0]],
      "hiddenToOutput":[0],
      "puntaje":0
    }
    var i=0;
    var inputToHidden=[[0]];
    var j;
    var hiddenToOutput=[0];
    for (i=0;i<=inputsCant;i++){
      inputToHidden[i]=[0];
      for(j in hidden){
        inputToHidden[i][j]=Math.random()
      }
    }
    for (i in hidden){
      hiddenToOutput[i]=Math.random()
    }
    snakes[c].inputToHidden=inputToHidden;
    snakes[c].hiddenToOutput=hiddenToOutput;
  }
}
function newSnakesNeuronsFromBest(cantSnake){
  console.log("bestSnake es:");
  console.log(bestSnake);
  var max=snakes.length;
  for (var c=max;c<(cantSnake+max);c++){
    snakes[c]={
      "inputToHidden":[[0]],
      "hiddenToOutput":[0],
      "puntaje":0
    }
    var i=0;
    var inputToHidden=[[0]];
    var j;
    var hiddenToOutput=[0];
    for (i=0;i<=inputsCant;i++){
      inputToHidden[i]=[0];
      for(j in hidden){
        inputToHidden[i][j]=bestSnake.inputToHidden[i][j]+(Math.random()*alfa)
      }
    }
    for (i in hidden){
      hiddenToOutput[i]=bestSnake.hiddenToOutput[i]+(Math.random()*alfa)
    }
    snakes[c].inputToHidden=inputToHidden;
    snakes[c].hiddenToOutput=hiddenToOutput;
  }
  snakes[cantSnake+max]={
    "inputToHidden":[[0]],
    "hiddenToOutput":[0],
    "puntaje":0
  }
  snakes[cantSnake+max].inputToHidden=bestSnake.inputToHidden;
  snakes[cantSnake+max].hiddenToOutput=bestSnake.hiddenToOutput;
}
function think(input){
  var f;
  var i;
  var arToHid=[0];
  var hidRes=[0];
  var hidToOut=[0];
  for (f in hidden){
    arToHid=[0];
    hidRes=[0];
    for (i=0;i<inputsCant;i++){
      arToHid[i]=input[i]*snakes[currSnake].inputToHidden[i][f];
    }
    hidRes[f]=hidden[f](arToHid);
    hidToOut[f]=hidRes[f]*snakes[currSnake].hiddenToOutput[f]
  }
  return readOutput(hidToOut);
}

function nextSnake(){
  currSnake++;
  if (currSnake>=snakes.length) {
    snakes=[0];
    newSnakesNeurons(25);
    newSnakesNeuronsFromBest(74);
    currSnake=0;
    generation++;
    console.log("generacion: " + generation);
  }
}
function bestOne(){
  console.log("puntaje actual" + puntaje + "puntaje anterio" +bestSnake.puntaje);
  if(bestSnake.puntaje<puntaje){
    bestSnake=snakes[currSnake];
    bestSnake.puntaje=puntaje;
  }
}
