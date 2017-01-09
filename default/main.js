var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDestroyer = require('role.destroyer');
var debug = false;
var body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

module.exports.loop = function () {

    console.log("Time: " + Game.time);

    // var tower = Game.getObjectById('a8a37b9a82e38e87f2840b76');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //             filter: (structure) => structure.hits < structure.hitsMax
    // });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }
    //
    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }



    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    spawnCreeps([
        ['harvester',3],
        ['upgrader',10],
        ['builder',10 ]
    ]);


    var destroyers = _.filter(Game.creeps, (creep) => creep.memory.role == 'destroyer');
    if(destroyers.length < 1) {
        var newName = Game.spawns['Spawn1'].createCreep([ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE], getRandomName("Destr_"), {role: 'destroyer'});
        console.log('Spawning new destroyer: ' + newName);
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
        if (creep.memory.role == 'destroyer') {
            roleDestroyer.run(creep);
        }
    }
}


function getRandomInt() {
    return Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
}

function getRandomName(pref) {
    var currentdate = new Date();
    var datetime = ""
        + currentdate.getFullYear()
        + (currentdate.getMonth()+1)
        + currentdate.getDate()
        + currentdate.getHours()
        + currentdate.getMinutes()
        + currentdate.getSeconds();

    return pref + datetime;
}

function debug_log(msg){
    if (debug)
        console.log(msg);
}

function spawnCreep(role){
    var newName = Game.spawns['Spawn1'].createCreep(body, getRandomName(role + "_"), {role: role});
    console.log('Spawning new ' + role + ': ' + newName);
    if (parseInt(newName) >= 0) return true;
    else return false;
}

function spawnCreeps(needs){
    var needsMap = new Map(needs);

    var stop = false;
    for (var [role, max] of needsMap){
        var count = getCreepsQuantity(role)
        console.log('Num of ' + role + 's: ' + count + "/" + max);
        if (count < max && !stop){
            var ret = spawnCreep(role);
            stop = true;
        }
    }

}

function getCreepsQuantity(role){
    var ret = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    return ret.length;
}