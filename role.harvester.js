var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.distrabuting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.distrabuting = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.distrabuting && creep.store.getFreeCapacity() == 0) {
            creep.memory.distrabuting = true;
            creep.say('📦 distrabute');
        }
        if (!creep.memory.distrabuting) {
            var sources = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    // console.log(creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } })); => 0 als het niet kan denk ik
                }
            } else {
                creep.moveTo(Game.flags.idleHarvester, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleHarvester;