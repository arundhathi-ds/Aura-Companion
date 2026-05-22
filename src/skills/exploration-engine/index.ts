import { Skill } from '../../core/skill-registry';
import { recommend } from './recommendation';
import { addPlace } from './world-model';

const skill: Skill = {
  meta: { id: 'exploration-engine', name: 'Exploration Engine', description: 'Generates two-doors side quests.' },
  triggers: [{ type: 'user_intent', pattern: 'explore' }],
  emotionalTone: { valence: 0.2, energy: 0.6 },
  hooks: {
    async respond({ input }: any) {
      // when asked for an adventure, recommend one
      if (input?.text?.includes('adventure') || input?.context?.want === 'mission') {
        const mission = recommend(input.context ?? {});
        return `${mission.hook} ${mission.action}`;
      }
      return '';
    },
  },
  actions: {
    onTrigger({ payload }: any) {
      if (payload?.place) addPlace(payload.place);
      return { ok: true };
    },
  },
};

export default skill;
