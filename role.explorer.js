var roleExplorer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.memory.direction = 1;
        if (creep.pos.roomName != creep.memory.roomName) {
            creep.memory.forceLeave = false;
        }
        creep.memory.roomName = creep.pos.roomName;
        if (creep.memory.exploring && (creep.room.controller.owner == undefined || (creep.room.controller.owner.username != "OldMartijntje" && creep.room.controller.owner.username != "Tomsom999" && creep.room.controller.owner.username != "Mielesgames")) && !creep.memory.forceLeave) {
            creep.memory.exploring = false;
            creep.say('🔎 claim');
        }
        if (!creep.memory.exploring && (creep.room.controller.owner != undefined && (creep.room.controller.owner.username == "OldMartijntje" || creep.room.controller.owner.username == "Tomsom999" || creep.room.controller.owner.username == "Mielesgames") || creep.memory.forceLeave)) {
            creep.memory.exploring = true;
            creep.say('📡 exploring');
        }

        if (creep.memory.exploring || creep.memory.forceLeave) {
            if (creep.memory.direction == 1) {
                var exit = creep.pos.findClosestByPath(FIND_EXIT_TOP);
            } else if (creep.memory.direction == 2) {
                var exit = creep.pos.findClosestByPath(FIND_EXIT_BOTTOM);
            } else if (creep.memory.direction == 3) {
                var exit = creep.pos.findClosestByPath(FIND_EXIT_LEFT);
            } else if (creep.memory.direction == 4) {
                var exit = creep.pos.findClosestByPath(FIND_EXIT_RIGHT);
            } else {
                creep.memory.direction = 1;
                var exit = creep.pos.findClosestByPath(FIND_EXIT_TOP);
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
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else if (creep.claimController(creep.room.controller) == ERR_GCL_NOT_ENOUGH) {
                    if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
                    } else {
                        creep.memory.forceLeave = true;
                    }
                } else {
                    creep.say('ok');
                }
            }
        }
    }
};

module.exports = roleExplorer;