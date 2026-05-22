// Very small world-model placeholder — in a real system this would track places,
// known items, and recent discoveries to enrich missions.

export type WorldModel = { knownPlaces?: string[] };

const model: WorldModel = { knownPlaces: [] };

export function addPlace(p: string) {
  if (!model.knownPlaces?.includes(p)) model.knownPlaces!.push(p);
}

export function getPlaces() {
  return model.knownPlaces ?? [];
}

export default { addPlace, getPlaces };
