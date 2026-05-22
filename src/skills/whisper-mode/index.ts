import { Skill } from '../../core/skill-registry';
import prompts from './prompts';
import personality from './personality';
import actions from './actions';

const skill: Skill = {
  meta: {
    id: 'whisper-mode',
    name: 'Whisper Mode',
    description: 'Softer, poetic companion voice for late-night interactions.',
  },
  triggers: [{ type: 'time_of_day', pattern: 'night' }, { type: 'user_pref', pattern: 'whisper_mode' }],
  personality,
  emotionalTone: { valence: 0.1, energy: 0.1 },
  actions,
  hooks: {
    async respond({ input }: any) {
      const text = `${prompts.reply(input?.text ?? '')}`;
      // In a real system you'd call an LLM here. For now return a hint.
      return `*whisper* ${input?.text ? `I hear ${input.text.split(' ')[0]}...` : "I'm here."}`;
    },
  },
};

export default skill;
