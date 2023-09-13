var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleExplorer = require('role.explorer');

function addRandomPartToBody(type, body, spawnName) {
    var item = settings[type][spawnName]["prioritize"][Math.floor(Math.random() * settings[type][spawnName]["prioritize"].length)];
    body.push(item);
    return body;
}

function createScreepIfNotEnough(type, body, spawnName) {
    var screeps = _.filter(Game.creeps, (creep) => creep.memory.role == type);
    console.log(type + 's: ' + screeps.length);
    var spawnScreeps = _.filter(screeps, (creep) => creep.memory.spawn == spawnName);
    if (spawnScreeps.length < settings[type][spawnName]["minimumUnits"]) {
        if (spawnScreeps.length >= settings[type][spawnName]["improveAfter"]) {
            body = addRandomPartToBody(type, body, spawnName)
        }
        var newName = type + Game.time;
        var value = Game.spawns[spawnName].spawnCreep(body, newName,
            {
                memory: {
                    role: type,
                    spawn: spawnName
                }
            })
        if (value == 0) {
            console.log('Spawning new ' + type + ": " + newName + " at: " + spawnName + ", with these parts: " + body);
        }
    }
}

settings = {
    "harvester": {
        "Spawn1": {
            "minimumUnits": 4,
            "improveAfter": 2,
            "prioritize": [WORK, CARRY, MOVE]
        }
    },
    "upgrader": {
        "Spawn1": {
            "minimumUnits": 5,
            "improveAfter": 1,
            "prioritize": [WORK, MOVE, CARRY]
        }
    },
    "builder": {
        "Spawn1": {
            "minimumUnits": 1,
            "improveAfter": 1,
            "prioritize": [CARRY, MOVE]
        }
    },
    "explorer": {
        "Spawn1": {
            "minimumUnits": 1,
            "improveAfter": 0,
            "prioritize": [MOVE, HEAL]
        }
    },
    "repairer": {
        "Spawn1": {
            "minimumUnits": 0,
            "improveAfter": 0,
            "prioritize": [MOVE, WORK]
        }
    }
}

module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var tower = Game.getObjectById('bce4e9c3b1875428f64c5cce');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Game.spawns) {
        createScreepIfNotEnough('harvester', [WORK, CARRY, MOVE, MOVE, MOVE], name);
        createScreepIfNotEnough('upgrader', [WORK, CARRY, MOVE, MOVE, MOVE], name);
        createScreepIfNotEnough('builder', [WORK, WORK, CARRY, MOVE, MOVE, MOVE], name);
        createScreepIfNotEnough('explorer', [CLAIM, MOVE, MOVE], name);
        createScreepIfNotEnough('repairer', [WORK, CARRY, MOVE], name);
    }





    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}