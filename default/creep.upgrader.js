var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var drop = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);

            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            })[0];

            drop_dist = creep.pos.getRangeTo(drop);
            container_dist = creep.pos.getRangeTo(container);

            if (drop && drop_dist < container_dist) {
                if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(drop);
                }
            }
            else {
                if (creep.withdraw(container, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
    }
};

module.exports = roleUpgrader;