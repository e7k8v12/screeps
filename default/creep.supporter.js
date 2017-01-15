var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.supporting && creep.carry.energy == 0) {
            creep.memory.supporting = false;
            creep.say('harvesting');
        }
        if (!creep.memory.supporting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.supporting = true;
            creep.say('supporting');
        }

        if (creep.memory.supporting) {

            var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => structure.hits < 1000});
            if (closestDamagedStructure) {
                if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE)
                    creep.moveTo(closestDamagedStructure);

            }
            else{

                DamagedStructures = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax});
                DamagedStructures.sort(function(a,b){return a.hits - b.hits});

                closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => structure.hits == DamagedStructures[0].hits});
                if (closestDamagedStructure) {
                    if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE)
                        creep.moveTo(closestDamagedStructure);

                }
            }

        }
        else {

            var drop = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            if (drop) {
                if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(drop);
                }
            }
            else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

        }
    }
};

module.exports = roleBuilder;