// Minimal memory manager interface. In the real app this would delegate to
// Supabase or another persistence system. We keep it pluggable and simple.

export type MemoryRecord = { id?: string; userId?: string; type?: string; payload?: any; createdAt?: string };

const inMemoryStore: MemoryRecord[] = [];

export async function saveMemory(rec: MemoryRecord) {
  const newRec = { ...rec, id: (Math.random() + '').slice(2), createdAt: new Date().toISOString() };
  inMemoryStore.push(newRec);
  return newRec;
}

export async function queryMemories(userId?: string, type?: string) {
  return inMemoryStore.filter((r) => (userId ? r.userId === userId : true) && (type ? r.type === type : true));
}

export async function clearMemories() {
  inMemoryStore.length = 0;
}

export default { saveMemory, queryMemories, clearMemories };
