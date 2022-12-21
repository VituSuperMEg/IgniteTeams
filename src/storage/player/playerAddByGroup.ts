import AsyncStorage
from "@react-native-async-storage/async-storage";
import { PlayeStorageDTO } from "./PlayerStorageDTO";
import { AppError } from "../../utils/appError";
import { playerGetByGroup } from "./playerGetByGroup";
import { PLAYER_COLLECTION } from "../storageConfig";



export async function playerAddByGroup(newPlayer : PlayeStorageDTO, group : string){
  try {

    const storedPlayers = await playerGetByGroup (group);

    const playerAlreadyExists = storedPlayers.filter(player => player.name === newPlayer.name);

    const storage = JSON.stringify([...storedPlayers, newPlayer]);


    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
  } catch (error) {
    throw(error);
  }
}