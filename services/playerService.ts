
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

  getPlayerProfile: async (uid: string) => {
    const snap = await getDoc(doc(db, COLLECTION_NAME, uid));
    return snap.exists() ? (snap.data() as Player) : null;
  },

  createPlayerProfile: async (user: User, name: string, position: Player['position']) => {
    const playerRef = doc(db, COLLECTION_NAME, user.uid);
    const isAdminEmail = user.email === ADMIN_EMAIL;
    
    // Verifica se é o primeiro usuário para ser admin
    const q = query(collection(db, COLLECTION_NAME), limit(1));
    const firstSnap = await getDocs(q);
    const isFirst = firstSnap.empty;

    const newPlayer: Player = {
      id: user.uid,
      name: name,
      position: position,
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
    return newPlayer;
  },

  ensurePlayerProfile: async (user: User) => {
    const isAdminEmail = user.email === ADMIN_EMAIL;
    const profile = await playerService.getPlayerProfile(user.uid);
    
    if (profile && isAdminEmail && profile.role !== 'admin') {
      await updateDoc(doc(db, COLLECTION_NAME, user.uid), { role: 'admin' });
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
