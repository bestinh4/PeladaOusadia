
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  setDoc,
  getDoc,
  getDocs,
  limit,
  FirestoreError
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { Player } from "../types";
import { User } from "firebase/auth";

const COLLECTION_NAME = "players";
const ADMIN_EMAIL = "diiogo49@gmail.com";

export const playerService = {
  subscribeToPlayers: (
    callback: (players: Player[]) => void, 
    onError: (error: FirestoreError) => void
  ) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
    
    return onSnapshot(
      q, 
      (snapshot) => {
        const players = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Player[];
        callback(players);
      },
      (error) => {
        console.error("Firestore Subscription Error:", error);
        onError(error);
      }
    );
  },

  ensurePlayerProfile: async (user: User) => {
    try {
      const playerRef = doc(db, COLLECTION_NAME, user.uid);
      const snap = await getDoc(playerRef);
      
      const isAdminEmail = user.email === ADMIN_EMAIL;

      if (!snap.exists()) {
        // Verifica se é o primeiro usuário para torná-lo admin como fallback universal
        const q = query(collection(db, COLLECTION_NAME), limit(1));
        const firstSnap = await getDocs(q);
        const isFirst = firstSnap.empty;

        const newPlayer: Player = {
          id: user.uid,
          name: user.displayName || 'Novo Atleta',
          position: 'Midfielder',
          level: 'Amador',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          confirmed: false,
          paid: false,
          role: (isFirst || isAdminEmail) ? 'admin' : 'player',
          goals: 0,
          assists: 0,
          matches: 0,
          rating: 60,
          stats: {
            pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50
          }
        };
        await setDoc(playerRef, newPlayer);
      } else {
        // Se o perfil já existe mas o e-mail é o do mestre, garante que ele seja Admin
        const currentData = snap.data();
        if (isAdminEmail && currentData?.role !== 'admin') {
          await updateDoc(playerRef, { role: 'admin' });
        }
      }
    } catch (error) {
      console.error("Erro ao garantir perfil:", error);
      throw error;
    }
  },

  updateProfile: async (playerId: string, data: Partial<Player>) => {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, data);
  },

  togglePresence: async (playerId: string, currentStatus: boolean) => {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, { confirmed: !currentStatus });
  },

  togglePayment: async (playerId: string, currentStatus: boolean) => {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, { paid: !currentStatus });
  },

  uploadAvatarToStorage: async (playerId: string, file: File): Promise<string> => {
    const storageRef = ref(storage, `avatars/${playerId}_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  updateAvatar: async (playerId: string, avatarUrl: string) => {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, { avatar: avatarUrl });
  }
};
