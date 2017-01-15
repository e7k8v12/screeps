var roleEminer0 = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var source_number = 0;
        var link_number = 1;

        var posX = 18;
        var posY = 9;

        if (creep.pos.x != posX || creep.pos.y != posY)
            creep.moveTo(posX, posY);

        var source = creep.room.find(FIND_SOURCES)[source_number];
        var storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            }
        })[0];
        var link = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            }
        })[link_number];

        if (creep.memory.order == undefined) {
            creep.memory.order = 'source'
        }

        if (creep.carry.energy == 0 && creep.memory.order == 'source') {
            if (creep.harvest(source) != 0){
                creep.withdraw(link, RESOURCE_ENERGY);
            }
            creep.memory.order = 'link'
        }
        else if (creep.carry.energy == 0 && creep.memory.order == 'link') {
            if (creep.withdraw(link, RESOURCE_ENERGY) != 0){
                creep.harvest(source);
            }
            creep.memory.order = 'source'

        }
        else {
            creep.transfer(storage, RESOURCE_ENERGY);
        }

    }
};

module.exports = roleEminer0;