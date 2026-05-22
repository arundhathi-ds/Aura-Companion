import { Skill } from '../../core/skill-registry';
import memory from '../../core/memory-manager';

const skill: Skill = {
  meta: { id: 'journaling-engine', name: 'Journaling Engine', description: 'Analyze and persist journal entries.' },
  triggers: [{ type: 'user_action', pattern: 'journal' }],
  hooks: {
    async respond({ input }: any) {
      if (input?.context?.journal) {
        const summary = (input.context.journal || '').slice(0, 120);
        await memory.saveMemory({ type: 'journal', payload: { summary } });
        return 'A single tender sentence that captures the heart of your unburdening.';
      }
      return '';
    },
  },
};

export default skill;
