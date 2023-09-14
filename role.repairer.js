var roleRepairer = {
    /** @param {Creep} creep **/
    // a function to run the logic for this role
    run: function (creep) {
        if (creep.memory.repairing && creep.store.energy == 0) {
            creep.memory.repairing = false;
            creep.memory.healingTarget = undefined;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🔨 repair');
        }


        if (creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL && object.room.controller.owner.username == "OldMartijntje"
            });
            console.log(`Targets to heal without walls: ${targets.length}`)
            if (targets.length < 5) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax && object.room.controller.owner.username == "OldMartijntje"
                });
                console.log(`Targets to heal with walls: ${targets.length}`)
            }
            if (creep.memory.healingTarget != undefined && Game.getObjectById(creep.memory.healingTarget).hits < Game.getObjectById(creep.memory.healingTarget).hitsMax) {
                if (creep.repair(Game.getObjectById(creep.memory.healingTarget)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.healingTarget), { visualizePathStyle: { stroke: '#3f51b5', opacity: .5 } });
                }
            } else if (targets.length == 0) {
                creep.moveTo(Game.flags.idleRepairer, { visualizePathStyle: { stroke: '#ffffff' } });
            } else {
                targets.sort((a, b) => {
                    a.hits - b.hits;
                });
                if (targets.length > 0) {
                    topTargets = targets.slice(0, Math.ceil(targets.length / 10) + 4);
                    const target = creep.pos.findClosestByPath(topTargets);
                    if (target != null) {
                        creep.memory.healingTarget = target.id;
                        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#3f51b5', opacity: .5 } });
                        }
                    }
                } else {
                    creep.moveTo(Game.flags.idleRepairer, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }

        }
        else {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE, {
                filter: object => object.room.controller.owner.username == "OldMartijntje"
            });
            if (sources.length == 0) {
                creep.moveTo(Game.flags.idleRepairer, { visualizePathStyle: { stroke: '#ffffff' } });
            } else {
                var source = creep.pos.findClosestByPath(sources);
                var tryToHarvest = creep.harvest(source)
                if (tryToHarvest == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else {

                }
            }

        }
    }
};
module.exports = roleRepairer;