
import { 
  collection, 
  onSnapshot, 
  doc, 
  query, 
  limit, 
  serverTimestamp, 
  writeBatch, 
  getDocs,
  where,
  setDoc
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
        const docSnap = snapshot.docs[0];
        callback({ id: docSnap.id, ...docSnap.data() } as Match);
      }
    });
  },

  subscribeToFeaturedImage: (callback: (url: string | null) => void) => {
    return onSnapshot(doc(db, CONFIG_COL, "featured_team"), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data().url);
      } else {
        callback(null);
      }
    });
  },

  updateFeaturedImage: async (file: File) => {
    try {
      const fileName = `featured/team_of_the_week_${Date.now()}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      await setDoc(doc(db, CONFIG_COL, "featured_team"), { 
        url, 
        updatedAt: serverTimestamp() 
      });
      return url;
    } catch (error: any) {
      console.error("Erro no upload da capa:", error);
      throw new Error(error.message || "Falha ao enviar imagem de destaque.");
    }
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
