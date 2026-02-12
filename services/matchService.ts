
import { 
  collection, 
  onSnapshot, 
  doc, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  getDocs,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Match } from "../types";

const MATCHES_COL = "matches";
const PLAYERS_COL = "players";

export const matchService = {
  subscribeToActiveMatch: (callback: (match: Match | null) => void) => {
    const q = query(
      collection(db, MATCHES_COL), 
      where("active", "==", true),
      orderBy("createdAt", "desc"), 
      limit(1)
    );
    
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
      } else {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() } as Match);
      }
    });
  },

  createMatch: async (matchData: Omit<Match, 'id' | 'active' | 'createdAt'>) => {
    // 1. Deactivate old matches
    const q = query(collection(db, MATCHES_COL), where("active", "==", true));
    const activeMatches = await getDocs(q);
    const batch = writeBatch(db);
    
    activeMatches.forEach((m) => {
      batch.update(doc(db, MATCHES_COL, m.id), { active: false });
    });

    // 2. Reset player confirmations and payment for the new match cycle
    const playersQ = await getDocs(collection(db, PLAYERS_COL));
    playersQ.forEach((p) => {
      batch.update(doc(db, PLAYERS_COL, p.id), { 
        confirmed: false, 
        paid: false 
      });
    });

    // 3. Create new match
    const newMatchRef = doc(collection(db, MATCHES_COL));
    batch.set(newMatchRef, {
      ...matchData,
      active: true,
      createdAt: serverTimestamp()
    });

    await batch.commit();
    return newMatchRef.id;
  }
};
