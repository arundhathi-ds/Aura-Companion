import { Skill } from '../../core/skill-registry';

const skill: Skill = {
  meta: { id: 'quiet-mode', name: 'Quiet Mode', description: 'Minimize companion output.' },
  triggers: [{ type: 'user_pref', pattern: 'quiet_mode' }],
  emotionalTone: { valence: 0.0, energy: 0.0 },
  hooks: {
    respond({ input }: any) {
      return input?.text ? "(softly) I see you." : '';
    },
  },
};

export default skill;
