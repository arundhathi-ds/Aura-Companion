import { Skill } from '../../core/skill-registry';
import memory from '../../core/memory-manager';

const skill: Skill = {
  meta: { id: 'memory-system', name: 'Memory System', description: 'Persistent memories adapter.' },
  hooks: {
    async respond() {
      return '';
    },
  },
  actions: {
    async save({ payload }: any) {
      return memory.saveMemory({ type: 'skill_saved', payload });
    },
  },
};

export default skill;
