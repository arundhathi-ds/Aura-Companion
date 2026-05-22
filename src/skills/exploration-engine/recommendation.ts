import { generateMission } from './missions';

export function recommend(context: any) {
  const vibe = context?.mood ?? 'quiet';
  return generateMission(vibe);
}

export default { recommend };
