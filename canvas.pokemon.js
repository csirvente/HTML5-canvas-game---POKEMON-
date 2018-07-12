

window.onload = function () {
    startGame();
};

function startGame() {
    var mycanvas = new Canvas();
    mycanvas.ctx.font = "20px Georgia";
    mycanvas.ctx.fillText("Press an arrow key to start!", 120, 200);

    //move with arrows key 
    $(".glyphicon").on('click', function (e) {
      touchMove = $(this).attr("class").split(' ')[1];
      //console.log($(this).attr("class").split(' ')[1]);
      if (touchMove == "left") mycanvas.myplayer.moveArg = "left";
        else if (touchMove == "up") mycanvas.myplayer.moveArg = "up";
        else if (touchMove == "right") mycanvas.myplayer.moveArg = "right";
        else if (touchMove == "down") mycanvas.myplayer.moveArg = "down";
        mycanvas.updateCanvas();
    });

    //move with arrows key on keyboard
    document.onkeydown = function (e) {
        e = e || window.event;
        if (e.keyCode == "37") mycanvas.myplayer.moveArg = "left";
        else if (e.keyCode == "38") mycanvas.myplayer.moveArg = "up";
        else if (e.keyCode == "39") mycanvas.myplayer.moveArg = "right";
        else if (e.keyCode == "40") mycanvas.myplayer.moveArg = "down";
        mycanvas.updateCanvas();
    };
};

//main sound
var mainTheme = new Audio("https://www.dropbox.com/s/uru3oz9mxzpt5gx/main-theme.mp3?raw=1");
mainTheme.loop = true;
mainTheme.volume = 0.5;
mainTheme.play();

//pokeball-selection
var pokePick = new Audio("https://www.dropbox.com/s/weemcqn1wlxelll/pickup.mp3?raw=1");
pokePick.volume = 0.8;

var direction = "stand"
//Canvas constructor
function Canvas() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.w = document.getElementById("canvas").offsetWidth;
    this.h = document.getElementById("canvas").offsetHeight;
    this.mybackgroundImage = new BackgroundImg(this.ctx, this.canvas);
    this.mybackgroundImage.draw();
    this.myscoreboard = new ScoreBoard();
    this.myplayer = new Player(this.ctx, this.canvas);
    this.myplayer.draw();
    this.moveArg = "";
    this.mypokeball = new Pokeball(this.ctx, this.canvas);
    this.mypokeball.generatePosition();

}

Canvas.prototype.updateCanvas = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mybackgroundImage.draw();
    this.mypokeball.draw();
    this.myplayer.draw();
    this.myscoreboard.draw();
    console.log(this.myplayer.player.x)

    if (this.myplayer.player.x == this.mypokeball.pokeball.x && this.myplayer.player.y == this.mypokeball.pokeball.y) { // found a pokeball !! create a new one
        console.log("found a pokeball of " + this.mypokeball.spritePosition + "! Bravo! ");
        pokePick.pause();
        pokePick.currentTime = 0;
        pokePick.play();
        this.mypokeball.generatePosition();
        this.mypokeball.draw();
        updateBattle();
    }
}


//house image & terrain variables
var terrainImage = new Image();
terrainImage.src = "images/pokemon_terrain.jpg";
var houseImage = new Image();
houseImage.src = "images/house.png";

//Background constructor
function BackgroundImg(ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.terrainImage = terrainImage;
    this.houseImage = houseImage;
}

BackgroundImg.prototype.draw = function () {
    this.ctx.drawImage(terrainImage, 0, 0);
    this.ctx.drawImage(houseImage, 80, 60);
};

function ScoreBoard() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.w = document.getElementById("canvas").offsetWidth;
    this.h = document.getElementById("canvas").offsetHeight;
}

ScoreBoard.prototype.draw = function () {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(this.w - 120, this.h - 70, 120, 70);
    this.ctx.font = "18px Arial";
    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.ctx.fillText("You catched", this.w - 110, this.h - 45)
    this.ctx.font = "14px Arial";
    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.ctx.fillText(winner + " pokemons", this.w - 100, this.h - 25);
    //this.myreq2 = requestAnimationFrame()
};

//pokeball image
var pokeballImage = new Image();
pokeballImage.src = "images/pokeball.png";

//Pokeball constructor
function Pokeball(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.pokeballSizes = 20;
    this.pokeball = {
        x: Math.floor(Math.random() * 20) + 1,
        y: Math.floor(Math.random() * 16) + 4,
        spritePosition: Math.floor(Math.random() * 4) + 0,
        spriteItemDistance: 33
    };
}

Pokeball.prototype.draw = function () {
    this.ctx.drawImage(
        pokeballImage,
        this.pokeball.spritePosition * this.pokeball.spriteItemDistance,
        0,
        this.pokeballSizes,
        this.pokeballSizes,
        this.pokeball.x * this.pokeballSizes,
        this.pokeball.y * this.pokeballSizes,
        this.pokeballSizes,
        this.pokeballSizes);
};

Pokeball.prototype.generatePosition = function () {
    this.pokeball.x = Math.floor(Math.random() * 20) + 1;
    this.pokeball.y = Math.floor(Math.random() * 16) + 4;
    this.pokeball.spritePosition = Math.floor(Math.random() * 4) + 0;// random sprite position image 0-4
};

//player image
var playerImage = new Image();
playerImage.src = "images/player.png";

//player constructor
function Player(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.w = document.getElementById("canvas").offsetWidth;
    this.h = document.getElementById("canvas").offsetHeight;
    this.playerSizes = 20;
    this.player = {
        x: Math.round((this.w / 2) / this.playerSizes),
        y: Math.round((this.h / 2) / this.playerSizes),
        // currentDirection: "stand",
        // direction: {
        //     "stand" : {
        //         x: 0,
        //         y: 0
        //     },
        // }
    };
};


Player.prototype.draw = function () {
    switch (this.moveArg) {
        case "left": this.player.x -= 1;
            break;
        case "right": this.player.x += 1;
            break;
        case "up": this.player.y -= 1;
            break;
        case "down": this.player.y += 1;
            break;
    }

    this.ctx.drawImage(
        playerImage,
        0, //this.player.direction[this.player.currentDirection].x, 
        0, //this.player.direction[this.player.currentDirection].y, 
        this.playerSizes - 2,
        this.playerSizes,
        this.player.x * this.playerSizes,
        this.player.y * this.playerSizes,
        this.playerSizes,
        this.playerSizes);

}



//Canvas Battle

function updateBattle() {
    var canvasBattle = document.getElementById("canvas-battle");
    var ctxBattle = canvasBattle.getContext("2d");

    canvas.classList.toggle('hidden');
    canvasBattle.classList.toggle('hidden');
    //terrain image
    var terrainImageBattle = new Image();
    terrainImageLoaded = false;
    terrainImageBattle.onload = function () {
        ctxBattle.drawImage(terrainImageBattle, 0, 0, 400, 400, 0, 0, 460, 460);

        terrainImageLoaded = true;
        startFight();
    }
    terrainImageBattle.src = "http://www.diygreat.com/cdn/20/1992/362/pokemon-battle_189249.png";

    // $('terrainImageBattle').on('load', function() {
    //     startFight()
    // });
    // terrainImageBattle.addEventListener("load", startFight)
    // setTimeout( startFight(),10000);

}

