var roleRepairer = {
    /** @param {Creep} creep **/
    // a function to run the logic for this role
    run: function (creep) {
        if (creep.memory.repairing && creep.store.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🔨 repair');
        }
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        if (creep.memory.repairing) {
            targets.sort((a, b) => a.hits - b.hits);
            if (targets.length > 0) {
                top5targets = targets.slice(0, 5);
                const target = creep.pos.findClosestByPath(top5targets);
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#3636AB' } });
                }
            } else {
                creep.moveTo(Game.flags.idleRepairer, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};
module.exports = roleRepairer;