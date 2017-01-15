var roleHarvester = {

        /** @param {Creep} creep **/
        run: function (creep) {
            source_number = 0;

            if (creep.carry.energy == 0) {
                creep.memory.transfering = false;
            }
            if (creep.carry.energy < creep.carryCapacity && !creep.memory.transfering) {
                var drop = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);

                var storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
                })[0];

                drop_dist = creep.pos.getRangeTo(drop);
                storage_dist = creep.pos.getRangeTo(storage);

                if (drop && drop_dist < storage_dist) {
                    if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(drop);
                    }
                }
                else {
                    if (storage.store[RESOURCE_ENERGY] == 0) {
                        creep.memory.transfering = true;
                    }
                    else if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
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
                    //towers

                    var tower = Game.getObjectById(creep.memory.tower);
                    if (tower && tower.energy / tower.energyCapacity < 0.8) {

                    }
                    else {
                        tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_TOWER &&
                                structure.energy / structure.energyCapacity < 0.2);
                            }
                        });
                    }
                    if (tower) {
                        creep.memory.tower = tower.id;
                        transfer_or_move(creep, tower);
                    }
                    // else {
                    //     target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    //         filter: (structure) => {
                    //             return (
                    //                 structure.structureType == STRUCTURE_STORAGE) &&
                    //                 structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    //         }
                    //     });
                    //     if (target) {
                    //         transfer_or_move(creep, target);
                    //     }
                    //     else {
                    //
                    //         creep.moveTo(Game.spawns['Spawn1']);
                    //     }
                    //}

                }
            }
        }
    }
    ;

function transfer_or_move(creep, target) {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

module.exports = roleHarvester;