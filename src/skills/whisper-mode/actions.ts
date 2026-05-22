import { saveMemory } from '../../core/memory-manager';

export const actions = {
  async onTrigger(payload: any) {
    // example: record that whisper mode was triggered
    await saveMemory({ type: 'skill_event', payload: { skill: 'whisper-mode', payload } });
    return { ok: true };
  },
};

export default actions;
