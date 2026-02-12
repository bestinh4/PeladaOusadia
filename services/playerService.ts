
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
  FirestoreError
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { Player } from "../types";
import { MOCK_PLAYERS } from "../constants";
import { User } from "firebase/auth";

const COLLECTION_NAME = "players";

export const playerService = {
  // Real-time listener
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

  // Ensure user has a player profile in Firestore
  ensurePlayerProfile: async (user: User) => {
    try {
      const playerRef = doc(db, COLLECTION_NAME, user.uid);
      const snap = await getDoc(playerRef);
      
      if (!snap.exists()) {
        const newPlayer: Player = {
          id: user.uid,
          name: user.displayName || 'Novo Atleta',
          position: 'Midfielder',
          level: 'Amador',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          confirmed: false,
          goals: 0,
          rating: 60,
          stats: {
            pac: 50,
            sho: 50,
            pas: 50,
            dri: 50,
            def: 50,
            phy: 50
          }
        };
        await setDoc(playerRef, newPlayer);
        console.log("Novo perfil de atleta criado para:", user.displayName);
      }
    } catch (error) {
      console.error("Erro ao garantir perfil do atleta:", error);
      throw error;
    }
  },

  // Toggle presence
  togglePresence: async (playerId: string, currentStatus: boolean) => {
    try {
      const playerRef = doc(db, COLLECTION_NAME, playerId);
      await updateDoc(playerRef, {
        confirmed: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling presence:", error);
      throw error;
    }
  },

  // Optimized Image Upload: Files go to Firebase Storage, URLs go to Firestore
  uploadAvatarToStorage: async (playerId: string, file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `avatars/${playerId}_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Storage Upload Error:", error);
      throw error;
    }
  },

  // Update Firestore with the new CDN URL
  updateAvatar: async (playerId: string, avatarUrl: string) => {
    try {
      const playerRef = doc(db, COLLECTION_NAME, playerId);
      await updateDoc(playerRef, {
        avatar: avatarUrl
      });
    } catch (error) {
      console.error("Error updating avatar in Firestore:", error);
      throw error;
    }
  },

  // Initial seed for demo purposes (only if collection is empty)
  seedPlayers: async () => {
    try {
      const q = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        for (const player of MOCK_PLAYERS) {
          await setDoc(doc(db, COLLECTION_NAME, player.id), player);
        }
        console.log("Database seeded successfully.");
      }
    } catch (error) {
      console.error("Seed Error:", error);
      throw error;
    }
  }
};
