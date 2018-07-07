var winner = 0;

function updateBattle2(cb) {
  var canvasBattle = document.getElementById("canvas-battle");
  var ctxBattle = canvasBattle.getContext("2d");

  //terrain image
  var terrainImageBattle = new Image();
  var pokemonBattle = new Image();
  terrainImageBattle.onload = function () {
    ctxBattle.drawImage(terrainImageBattle, 0, 0, 400, 400, 0, 0, 460, 460);
    cb();
  }
  terrainImageBattle.src = "http://www.diygreat.com/cdn/20/1992/362/pokemon-battle_189249.png";

  pokemonBattle.onload = function () {
  ctxBattle.drawImage(pokemonBattle, 0, 0, 160, 160, 250, 50, 160,160);
}
  switch (pokemonStats[wildPokemonid].type){
    case "Squirtle":
    pokemonBattle.src = "images/squirtle.png";
    break;
    case "Bulbasaur":
      pokemonBattle.src = "images/bulbasaur.png";
    break;
    case "Charmander":
      pokemonBattle.src = "images/charmander.png";
    break;
    case "Pikachu":
    pokemonBattle.src = "images/pikachu.png";
  break;
  }
  // pokemonBattle.src = "https://raw.githubusercontent.com/elletricity/sprites/master/pk/001.png";

}

//////////////////////////////////////////////
//////////////////////////////////////////////
//CALL WILD POKEMON
function wildPokemon(type) {
  this.type = type;
}
//POKEMON ARRAY
var pokemonStats = new Array();
pokemonStats[0] = new wildPokemon("Squirtle");
pokemonStats[1] = new wildPokemon("Bulbasaur");
pokemonStats[2] = new wildPokemon("Charmander");
pokemonStats[3] = new wildPokemon("Pikachu");

//POKEMON ATTACK ARRAY
function move(move, basedmg) {
  this.move = move;
  this.basedmg = basedmg;
}

var moves = new Array();
moves[0] = new move("Slam", 5);
moves[1] = new move("Headbutt", 4);
moves[2] = new move("Tackle", 3);
moves[3] = new move("Cut", 4);
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//CALL WILD POKEMON STATS
//CALL WILD POKEMON ID
var wildPokemonid;
callWildPokemonid = function () {
  wildPokemonid = Math.floor(Math.random() * pokemonStats.length);
};
//CALL WILD POKEMON LEVEL
var wildPokemonLevel;
callWildPokemonLevel = function () {
  wildPokemonLevel = Math.floor(Math.random() * 6 + 1);
};
//CALL WILD POKEMON HEALTH  
var wildPokemonHealth;
callWildPokemonHealth = function () {
  wildPokemonHealth = Math.floor(Math.random() * wildPokemonLevel + 3);
};
//CALL WILD POKEMON ATTACK
var moveid;
callMoveid = function () {
  moveid = Math.floor(Math.random() * moves.length);
};
//CALL DAMAGE 
var damage;
//CALL WILD POKEMON ATTACK DAMAGE
callMoveDamage = function () {
  callMoveid();
  damage = Math.floor(Math.random() * moves[moveid].basedmg + 3);
};
//CALL PLAYER ATTACK DAMAGE
callPlayerMoveDamage = function () {
  damage = Math.floor(Math.random() * moves[playerMove].basedmg + 3);
};
//CALL PLAYER ATTACK
function selectMove() {
  playerMove = "CUT"; // prompt("You have 4 moves, " + moves[0].move + ", " + moves[1].move + ", " + moves[2].move + " and " + moves[3].move + ", which move do you want to use?").toUpperCase();
  if (playerMove === "") {
    selectMove();
  } else {
    switch (playerMove) {
      case 'SLAM':
        playerMove = 0;
        callPlayerMoveDamage();
        playerAttack();
        break;
      case 'HEADBUTT':
        playerMove = 1;
        callPlayerMoveDamage();
        playerAttack();
        break;
      case 'TACKLE':
        playerMove = 2;
        callPlayerMoveDamage();
        playerAttack();
        break;
      case 'CUT':
        playerMove = 3;
        callPlayerMoveDamage();
        playerAttack();
        break;
      default:
        messageDisplay('Move not found',function () {});
        selectMove();
        break;
    }
  }
}

///////////////////////////////////////////////////
//////////////////////////////////////////////////
//WILD POKEMON ATTACK
function wildPokemonAttack() {
  if (pokemonHealth > 0) {
    callMoveDamage();
    pokemonHealth = pokemonHealth - damage;
    messageDisplay("Wild " + pokemonStats[wildPokemonid].type + " uses " + moves[moveid].move + " dealing " + damage + " damage!",function () {});
    attackLoop();
  }
  else {
    messageDisplay("Pokemon fainted",function () {});
  }
}
//PLAYER ATTACK
function playerAttack() {
  messageDisplay("Player uses " + moves[playerMove].move + " dealing " + damage + " damage!",function () {
  if (wildPokemonHealth > 0) {
    wildPokemonHealth = wildPokemonHealth - damage;
    messageDisplay(pokemonStats[wildPokemonid].type + " has " + wildPokemonHealth + " health remaining!",function () {
    playerTurn = false;
    wildPokemonFaint()
    });
  }
  else {
    messageDisplay(pokemonStats[wildPokemonid].type + " fainted",function () {});
  }
});
}
//RANDOMIZE WILD POKEMON
function randomPokemon() {
  callWildPokemonid();
  callWildPokemonLevel();
  callWildPokemonHealth();
  callMoveid();
}

var pokemonHealth = 50;

//START FIGHT
function startFight() {
  // canvas.classList.toggle('hidden');
  // canvasBattle.classList.toggle('hidden');
  randomPokemon();
  messageDisplay("Wild " + pokemonStats[wildPokemonid].type + " appears!", function () {
    messageDisplay("Level : " + wildPokemonLevel + " Health : " + wildPokemonHealth, function () {
      playerTurn = false;
      attackLoop();
    });
  });
}

function attackLoop() {
  if (playerTurn === false) {
    playerTurn = true;
    wildPokemonAttack();
    
  } else {
    playerTurn = false;
    selectMove();
  }
}

function wildPokemonFaint() {
  if (wildPokemonHealth < 1) {
    messageDisplay(pokemonStats[wildPokemonid].type + " has fainted",function () {
      canvas.classList.toggle('hidden');
      var canvasBattle = document.getElementById("canvas-battle");
      canvasBattle.classList.toggle('hidden');
      winner+=1;
    });
  } else {
    attackLoop();
  }
}


function messageDisplay(msg, cb) {
  updateBattle2(function () {
    var canvasBattle = document.getElementById("canvas-battle");
    var ctxBattle = canvasBattle.getContext("2d");
    ctxBattle.font = "20px Georgia";
    ctxBattle.fillText(msg, 60, 400);
    setTimeout(function () {
      cb();
    }, 1000)
  });
}
