import AsyncStorage
from "@react-native-async-storage/async-storage";
import { PlayeStorageDTO } from "./PlayerStorageDTO";
import { PLAYER_COLLECTION } from "../storageConfig";


export async function playerGetByGroup(group: string) {
  try {
    const storage = await AsyncStorage.getItem(`${PLAYER_COLLECTION}-${group}`);

     const players : PlayeStorageDTO[] = storage ? JSON.parse(storage): [];

     return players;
  } catch (error) {
    throw error;
  }
}