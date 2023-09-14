var roleExplorer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        creep.memory.direction = 1;
        if (creep.memory.exploring && (creep.room.controller.owner != "OldMartijntje" && creep.room.controller.owner != "Tomsom999" && creep.room.controller.owner != "Mielesgames")) {
            creep.memory.exploring = false;
            creep.say('🔎 claim');
        }
        if (!creep.memory.exploring && (creep.room.controller.owner == "OldMartijntje" || creep.room.controller.owner == "Tomsom999" || creep.room.controller.owner == "Mielesgames")) {
            creep.memory.exploring = true;
            creep.say('📡 exploring');
        }

        if (creep.memory.exploring) {
            if (creep.memory.direction == 1) {
                var exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
            } else if (creep.memory.direction == 2) {
                var exit = creep.pos.findClosestByRange(FIND_EXIT_BOTTOM);
            } else if (creep.memory.direction == 3) {
                var exit = creep.pos.findClosestByRange(FIND_EXIT_LEFT);
            } else if (creep.memory.direction == 4) {
                var exit = creep.pos.findClosestByRange(FIND_EXIT_RIGHT);
            }
            if (exit == null && creep.memory.direction != 4) {
                creep.memory.direction += 1;
            } else if (exit == null && creep.memory.direction == 4) {
                creep.memory.direction = 1;
            }
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        else {
            if (creep.room.controller) {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                } else if (creep.claimController(creep.room.controller) == ERR_GCL_NOT_ENOUGH) {
                    if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    } else {
                        creep.say('What???');
                    }
                }
            }
        }
    }
};

module.exports = roleExplorer;