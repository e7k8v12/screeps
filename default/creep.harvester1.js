var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        source_number = 1;

        if (creep.carry.energy == 0) {
            creep.memory.transfering = false;
        }
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.transfering) {
            var drop = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);

            drop_dist = creep.pos.getRangeTo(drop);
            source_dist = creep.pos.getRangeTo(creep.room.find(FIND_SOURCES)[source_number]);

            if (drop && drop_dist < source_dist) {
                if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(drop);
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (sources[source_number].energy != 0) {
                    if (creep.harvest(sources[source_number]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[source_number]);
                    }
                }
                else{
                    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                    if (source) {
                        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                    }
                    else{
                        creep.memory.transfering = true;
                    }
                }
            }
        }
        else {
            creep.memory.transfering = true;

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target && !hostile) {
                transfer_or_move(creep, target);
            }
            else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER &&
                        structure.energy < structure.energyCapacity);
                    }
                });
                if (target) {
                    transfer_or_move(creep, target);
                }
                else {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                        }
                    });
                    if (target) {
                        transfer_or_move(creep, target);
                    }
                    else {

                        creep.moveTo(Game.spawns['Spawn1']);
                    }
                }

            }
        }
    }
};

function transfer_or_move(creep, target){
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
}

module.exports = roleHarvester;