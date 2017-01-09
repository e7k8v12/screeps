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
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            //if (targets.length) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                //}
            }
            else
            {
                var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => structure.hits < 1000});
                if (closestDamagedStructure) {
                    if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE)
                        creep.moveTo(closestDamagedStructure);

                }
                else{

                    DamagedStructures = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax});
                    DamagedStructures.sort(function(a,b){return a.hits - b.hits});

                    //console.log(DamagedStructures[0]);

                    closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => structure.hits == DamagedStructures[0].hits});
                    if (closestDamagedStructure) {
                        if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE)
                            creep.moveTo(closestDamagedStructure);

                    }
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            // var source = creep.pos.findClosestByRange(FIND_SOURCES);
            // if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(source);
            // }
        }
    }
};

module.exports = roleBuilder;