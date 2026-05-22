import { Skill } from '../../core/skill-registry';

const skill: Skill = {
  meta: { id: 'storyteller', name: 'Storyteller', description: 'Weaves small cinematic fragments.' },
  triggers: [{ type: 'user_intent', pattern: 'story' }],
  hooks: {
    async respond({ input }: any) {
      if (input?.text) return `Once, ${input.text.split(' ')[0]} found a small glowing thing.`;
      return '';
    },
  },
};

export default skill;
