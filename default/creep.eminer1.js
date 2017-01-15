var roleEminer0 = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var source_number = 1;
        var link_number = 0;

        var posX = 8;
        var posY = 45;

        if (creep.pos.x != posX || creep.pos.y != posY)
            creep.moveTo(posX, posY);

        var source = creep.room.find(FIND_SOURCES)[source_number];
        var storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        })[0];
        var link = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            }
        })[link_number];

        if (creep.memory.order == undefined) {
            creep.memory.order = 'storage'
        }

        if (creep.carry.energy == 0) {
            creep.harvest(source);
        }
        else if (creep.memory.order == 'link') {
            creep.transfer(link, RESOURCE_ENERGY);
            creep.memory.order = 'storage'

        }
        else {
            creep.transfer(storage, RESOURCE_ENERGY);
            creep.memory.order = 'link'
        }

    }
};

module.exports = roleEminer0;