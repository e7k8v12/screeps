var roleDestroer = {

    /** @param {Creep} creep **/
    run: function (creep) {


        target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if (target) {
            console.log(target);
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            parkingFlag = Game.flags.ParkingFlag;
            creep.moveTo(parkingFlag);

        }

    }
};

module.exports = roleDestroer;