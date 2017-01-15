var roleTower = {

    /** @param {Creep} creep **/
    run: function (tower) {

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            console.log("Tower target: " + closestHostile);
            tower.attack(closestHostile);
        }
        else {

            var DamagedStructures = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                    structure.structureType == STRUCTURE_RAMPART &&
                    structure.hits / structure.hitsMax < 0.1);
                }
            });
            if (DamagedStructures.length > 0) {
            }
            else {
                DamagedStructures = tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            //structure.structureType != STRUCTURE_ROAD &&
                        structure.hits / structure.hitsMax < 0.1);
                    }
                });
            }
            DamagedStructures.sort(function (a, b) {
                return a.hits - b.hits
            });

            try {
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => structure.hits == DamagedStructures[0].hits});

                if (closestDamagedStructure) {
                    console.log("Tower target: " + closestDamagedStructure);
                    tower.repair(closestDamagedStructure);
                }
            }
            catch (e) {
            }
        }
    }
};

module.exports = roleTower;