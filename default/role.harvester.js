var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.carry.energy == 0){
	        creep.memory.transfering = false;
        }
        if(creep.carry.energy < creep.carryCapacity && !creep.memory.transfering) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            creep.memory.transfering = true;

	        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {
                creep.moveTo(Game.spawns['Spawn1']);
            }

        }
	}
};

module.exports = roleHarvester;