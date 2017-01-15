var roleDestroer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        flag = Game.flags.goFlag;

        if (flag) {
            creep.moveTo(flag);
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

            if (target) {
                console.log(target);
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else{
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);

                if (target) {
                    console.log(target);
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            // else {
            //     parkingFlag = Game.flags.ParkingFlag;
            //     creep.moveTo(parkingFlag);
            //
            // }

        }
    }
};

module.exports = roleDestroer;