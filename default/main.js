var debug = false;

var creeps_roles = {
    'harvester0': {
        'role': require('creep.harvester0'),
        'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    'harvester1': {
        'role': require('creep.harvester1'),
        'body': [CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    'upgrader': {
        'role': require('creep.upgrader'),
        'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    'builder': {
        'role': require('creep.builder'),
        'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
    },
    'destroyer': {
        'role': require('creep.destroyer'),
        'body': [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
    },
    'supporter': {
        'role': require('creep.supporter'), 'body': [CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK]
    },
    'eminer0': {
        'role': require('creep.eminer0'),
        'body': [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE]
    },
    'eminer1': {
        'role': require('creep.eminer1'),
        'body': [CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
};

var tower_role = require('tower');


var ConstMap = new Map();
ConstMap.set(-15, "ERR_GCL_NOT_ENOUGH");
ConstMap.set(-14, "ERR_RCL_NOT_ENOUGH");
ConstMap.set(-12, "ERR_NO_BODYPART");
ConstMap.set(-11, "ERR_TIRED");
ConstMap.set(-10, "ERR_INVALID_ARGS");
ConstMap.set(-9, "ERR_NOT_IN_RANGE");
ConstMap.set(-8, "ERR_FULL");
ConstMap.set(-7, "ERR_INVALID_TARGET");
ConstMap.set(-6, "ERR_NOT_ENOUGH_ENERGY | EXTENSIONS | RESOURCES");
ConstMap.set(-5, "ERR_NOT_FOUND");
ConstMap.set(-4, "ERR_BUSY");
ConstMap.set(-3, "ERR_NAME_EXISTS");
ConstMap.set(-2, "ERR_NO_PATH");
ConstMap.set(-1, "ERR_NOT_OWNER");
ConstMap.set(0, "OK");


module.exports.loop = function () {

    console.log("--------------");
    //console.log("Time: " + Game.time);

    var linkFrom = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES,
        {filter: {structureType: STRUCTURE_LINK}})[0];

    var linkTo = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES,
        {filter: {structureType: STRUCTURE_LINK}})[1];

    linkFrom.transferEnergy(linkTo);

    towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER});
    if (towers.length > 0) {
        for (tower_num in towers) {
            tower_role.run(towers[tower_num]);
        }
    }


    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    spawnCreeps([
        ['eminer0', 1],
        ['eminer1', 1],
        ['harvester0', 1],
        ['harvester1', 0],
        ['destroyer', 0],
        ['builder', 0],
        ['upgrader', 1],
        ['supporter', 0]
    ]);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        for (var role in creeps_roles) {
            if (creep.memory.role == role) {
                creeps_roles[role].role.run(creep);
            }
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
        + add0(currentdate.getMonth() + 1)
        + add0(currentdate.getDate())
        + add0(currentdate.getHours())
        + add0(currentdate.getMinutes())
        + add0(currentdate.getSeconds());

    return pref + datetime;
}

function add0(n) {
    var nn = "" + n;
    while (nn.length < 2) {
        nn = "0" + nn;
    }
    return nn

}

function debug_log(msg) {
    if (debug)
        console.log(msg);
}

function spawnCreep(role) {
    var newName = Game.spawns['Spawn1'].createCreep(creeps_roles[role].body, getRandomName(role + "_"), {role: role});
    err_name = ConstMap.get(newName);

    var msg = '';
    if (err_name)
        msg = err_name + " (" + newName + ")";
    else
        msg = newName;

    console.log('Spawning new ' + role + ': ' + msg);
    if (parseInt(newName) >= 0) return true;
    else return false;
}

function spawnCreeps(needs) {
    var needsMap = new Map(needs);

    var stop = false;
    for (var [role, max] of needsMap) {
        var creeps = getCreeps(role);
        var ages = '';
        for (var i = 0; i < creeps.length; i++) {
            if (!creeps[i].ticksToLive)
                ages += "building " + Game.spawns['Spawn1'].spawning.remainingTime + "/" + Game.spawns['Spawn1'].spawning.needTime + "t, ";
            else
                ages += creeps[i].ticksToLive + ", ";
        }
        ages = ages.slice(0, -2);
        if (creeps.length > 0)
            console.log('Num of ' + role + 's: ' + creeps.length + "/" + max + " Ages: " + ages);
        else
            console.log('Num of ' + role + 's: ' + creeps.length + "/" + max);
        if (creeps.length < max && !stop) {
            var ret = spawnCreep(role);
            stop = true;
        }
    }

}

function getCreeps(role) {
    var ret = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    return ret;
}