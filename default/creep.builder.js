var roleBuilder = {

        /** @param {Creep} creep **/
        run: function (creep) {



            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('harvesting');
            }

            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('building');
            }

            if (creep.memory.building) {
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    creep.moveTo(Game.flags.ParkingFlag);
                }

            }
            else {

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
            }
        }
    }
    ;

module.exports = roleBuilder;