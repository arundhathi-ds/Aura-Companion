import { Skill } from '../../core/skill-registry';

const skill: Skill = {
  meta: { id: 'emotional-intelligence', name: 'Emotional Intelligence', description: 'Analyze mood and shape tone.' },
  triggers: [{ type: 'user_event', pattern: 'mood_update' }],
  emotionalTone: { valence: 0.1, energy: 0.1 },
  hooks: {
    async respond({ input }: any) {
      // Suggest a reflection question when mood is low
      if (input?.context?.mood === 'low') return 'What small thing felt different today?';
      return '';
    },
  },
};

export default skill;
