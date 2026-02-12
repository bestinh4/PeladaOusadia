
import { 
  collection, 
  onSnapshot, 
  doc, 
  query, 
  limit, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  getDocs,
  where,
  setDoc,
  getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { Match } from "../types";

const MATCHES_COL = "matches";
const PLAYERS_COL = "players";
const CONFIG_COL = "app_config";

export const matchService = {
  subscribeToActiveMatch: (callback: (match: Match | null) => void) => {
    const q = query(
      collection(db, MATCHES_COL), 
      where("active", "==", true),
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

  subscribeToFeaturedImage: (callback: (url: string | null) => void) => {
    return onSnapshot(doc(db, CONFIG_COL, "featured_team"), (doc) => {
      if (doc.exists()) {
        callback(doc.data().url);
      } else {
        callback(null);
      }
    });
  },

  updateFeaturedImage: async (file: File) => {
    const storageRef = ref(storage, `featured/team_of_the_week_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    await setDoc(doc(db, CONFIG_COL, "featured_team"), { url, updatedAt: serverTimestamp() });
    return url;
  },

  createMatch: async (matchData: Omit<Match, 'id' | 'active' | 'createdAt'>) => {
    const q = query(collection(db, MATCHES_COL), where("active", "==", true));
    const activeMatches = await getDocs(q);
    const batch = writeBatch(db);
    
    activeMatches.forEach((m) => {
      batch.update(doc(db, MATCHES_COL, m.id), { active: false });
    });

    const playersQ = await getDocs(collection(db, PLAYERS_COL));
    playersQ.forEach((p) => {
      batch.update(doc(db, PLAYERS_COL, p.id), { 
        confirmed: false, 
        paid: false 
      });
    });

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
