var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    var sources = creep.room.find(FIND_SOURCES);
	    if(creep.carry.energy == 0) {
            
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            else{
                creep.memory.action = true;
            }
            
        }
        else if (creep.memory.action){
            creep.harvest(sources[0]);
            if (creep.carry.energy == creep.carryCapacity){
                creep.memory.action = false;
            }
            
            
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;