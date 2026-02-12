
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  setDoc,
  getDocs,
  FirestoreError
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Player } from "../types";
import { MOCK_PLAYERS } from "../constants";

const COLLECTION_NAME = "players";

export const playerService = {
  // Escuta atletas em tempo real com tratamento de erro
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

  // Alterna confirmação de presença com tratamento de erro
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

  // Seed inicial com verificação de erro
  seedPlayers: async () => {
    try {
      const q = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        for (const player of MOCK_PLAYERS) {
          await setDoc(doc(db, COLLECTION_NAME, player.id), player);
        }
        console.log("Banco populado com sucesso!");
      }
    } catch (error) {
      console.error("Error seeding players (check your Firebase Rules):", error);
      throw error;
    }
  }
};
