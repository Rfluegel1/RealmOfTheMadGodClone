var wizard;
var enemies = [];
var projectiles = [];
var enemyCount = 5;

function setup() {
  createCanvas(800,650);
  wizard = new character();
  enemySetup();
}

function draw() {
  background(51);
  
  wizard.show();
  
  characterMovement();
  
  hitScanner();
  
  showEnemies();
  
  splicer();
}

function character(){
  this.x = width/2;
  this.y = height/2;
  
  this.show = function(){
    fill(255);
    ellipse(this.x, this.y, 50);
  }
  
  this.xMove = function(dir){
    this.x += dir;
  }
  
  this.yMove = function(dir){
    this.y += dir;
  }
}

function Enemy(x,y){
  this.x = x;
  this.y = y;
  this.r = 25;
  this.toDelete = false;
  this.xVel = 2;
  this.yVel = 2;
  this.hp = 2;
  this.shots = [];
  
  this.show = function(){
    fill(199,15,63);
    ellipse(this.x, this.y, this.r*2);
  }  
  this.disappear = function(){
   // this.hp--;
  //  if(this.hp == 0){
      this.toDelete = true;
    //}
  }
  
  this.move = function(){
    if(this.x > 800-25 || this.x < 0+25){
      this.xVel = -this.xVel;
    }
    this.x += this.xVel;
    if(this.y > 650-25 || this.y < 0+25){
      this.yVel = -this.yVel;
    }
    this.y += this.yVel;
  }
  
  this.shoot = function(wizard){
    var shot = new Projectile(this.x,this.y,wizard.x,wizard.y);
    if(this.shots.length < 3){
    this.shots.push(shot);
    }
    for(var i = 0; i < this.shots.length; i++){
      this.shots[i].show();
      this.shots[i].move(.1);
      var x1 = Math.pow((this.shots[i].x-this.shots[i].xMouse),2);
       var y1 = Math.pow((this.shots[i].y-this.shots[i].yMouse),2);
     if(Math.sqrt(x1+y1) > 350){
       this.shots.splice(i,1);
       }
    }
  }
}

function Projectile(x,y,xMouse, yMouse){
  this.x = x;
  this.y = y;
  this.xMouse = xMouse;
  this.yMouse = yMouse;
  this.r = 2.5;
  var velX = (x - xMouse)/100;
  var velY = (y - yMouse)/100;
  this.toDelete = false;
  
  this.show = function(){
    noStroke();
    fill(255, 105, 56);
    ellipse(this.x, this.y, this.r*2);
  }
  
  this.move = function(rate){
    this.x -= velX*12*rate;
    this.y -= velY*12*rate;
  }
  
  this.hits = function(enemy){
    var d = dist(this.x, this.y, enemy.x, enemy.y);
    if(d < this.r + enemy.r){
      return true;
    }else{
      return false;
    }
  }
  
  this.disappear = function(){
    this.toDelete = true;
  }
}

function characterMovement(){
   if(keyIsDown(keyCode = 68)){
    wizard.xMove(3);}
  if(keyIsDown(keyCode = 65)){
    wizard.xMove(-3);}
  if(keyIsDown(keyCode = 87)){
    wizard.yMove(-3);}
  if(keyIsDown(keyCode = 83)){
    wizard.yMove(3);}
}

function showEnemies(){
  for (var i = 0; i < enemyCount; i++){
    enemies[i].show();
    enemies[i].move();
    enemies[i].shoot(wizard);
  }
}

function splicer(){
  for (var i = 0; i < projectiles.length; i++){
    if(projectiles[i].toDelete){
      projectiles.splice(i,1);
   for(var j = 0; j< enemies.length; j++){
     if(enemies[j].toDelete){
       enemies.splice(j,1);
        }
      }
    }
  }
}

function hitScanner(){
  for (var i = 0; i < projectiles.length; i++){
    projectiles[i].show();
    projectiles[i].move(1);
    for(var j = 0; j< enemies.length; j++){
      if(projectiles[i].hits(enemies[j])){
        enemies[j].disappear();
        projectiles[i].disappear();
        enemyCount --;
        console.log("DIRECT HIT");
      }
    }
  }
}

function mouseClicked(){
  var projectile = new Projectile(wizard.x, wizard.y,mouseX, mouseY);
  console.log(mouseX + " " +mouseY);
  projectiles.push(projectile);
  console.log(enemies[1].shots.length);
}

function enemySetup(){
  for(var i = 0; i < 5; i++){
    this.x = random(width);
    this.y = random(height);
    while(this.x > (800-50) || this.x < (0+50)){
      this.x = random(width);
    }
    while(this.y > (650-50) || this.y < (0+50)){
      this.y = random(height);
    }
    enemies[i] = new Enemy(this.x, this.y);
  }
}