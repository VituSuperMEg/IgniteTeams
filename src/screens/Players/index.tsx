import { ButtonIcon } from "../../components/ButtonIcon";
import { Filter } from "../../components/Filter";
import { Header } from "../../components/Header";
import { Highlight } from "../../components/HighLight";
import { Input } from "../../components/Input";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { FlatList, Alert, TextInput } from "react-native"
import { useState, useEffect, useRef } from "react";
import { PlayerCard } from "../../components/PlayerCard";
import { ListEmpty } from "../../components/ListEmpty/indext";
import { Button } from "../../components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "../../utils/appError";
import { playerAddByGroup } from "../../storage/player/playerAddByGroup";
import { playerGetByGroup } from "../../storage/player/playerGetByGroup";
import { PlayeStorageDTO } from "../../storage/player/PlayerStorageDTO";
import { playersGetByGroupAndTeam } from "../../storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "../../storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "../../storage/group/groupRemoveByName";


type RouteParams = {
  group : string;
}
export function Players() {
  
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;
     
  const newPlayerNameInputRef = useRef<TextInput>(null);

  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayeStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  async function handleAddPlayers(){

     if(newPlayerName.trim().length === 0){
       return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar');
     }
    const newPlayer = {
      name : newPlayerName,
      team,
    }

    try {
       await playerAddByGroup(newPlayer, group);
       fetchPlayersByTeam();

       newPlayerNameInputRef.current?.blur();

       setNewPlayerName('');
       const players = await playerGetByGroup(group);
       console.log(players);

    } catch (error) {
      if( error instanceof AppError){
        Alert.alert('Nova pessoa', error.message);
      }else{
        console.log(error);
        Alert.alert('Nova pessoa', 'Não foi possível adicionar')
      }
    }
  }
   
  async function fetchPlayersByTeam(){
    try{
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    }catch(error){
      console.log(error);
    }
  }
  async function handleRemovePlayer(playerName : string){
    try {
      await playerRemoveByGroup(playerName, group); 
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert('Remove pessoa', 'Não foi possível remover essa pessoa.')
    }
  }

  async function groupRemove(){
   try {
    await groupRemoveByName(group);
    navigation.navigate('groups');
   } catch (error) {
      console.log(error);
      Alert.alert('Remove pessoa', 'Não foi possível remover o grupo');
   }
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text : 'Não', style : 'cancel'},
        { text : 'Sim', onPress: () => groupRemove()}
      ]
    )
  }
  useEffect(() => {
     fetchPlayersByTeam();
  }, [team]);
  return (
   <Container>
    <Header  showBackButton/>

    <Highlight 
      title={group}
      subtitle="Adicone a galera e separe os times"
    />
    <Form>
      <Input 
      inputRef={newPlayerNameInputRef}
      onChangeText={setNewPlayerName}
      value={newPlayerName}
      placeholder="Nome da Pessoa"
      autoCorrect={false}
      onSubmitEditing={handleAddPlayers}
      returnKeyType="done"
     />
      <ButtonIcon 
      icon="add" 
      type="PRIMARY"
      onPress={handleAddPlayers}
      />
     </Form>
     
     <HeaderList>
       <FlatList
        data={['Time A', 'Time B']}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Filter 
          title={item}
          isActive={item === team}
          onPress={() => setTeam(item)}
        />
      )}
      horizontal
      />
      <NumberOfPlayers>
        {players.length}
      </NumberOfPlayers>
     </HeaderList>
     <FlatList 
     data={players}
     keyExtractor={item => item.name}
     renderItem={({item}) => (
      <PlayerCard 
      name={item.name} 
      onRemove={() => handleRemovePlayer(item.name)}
      />
     )}
     ListEmptyComponent={() => (
      <ListEmpty 
      message="Não há pessoa na turma "/>
     )}
     showsVerticalScrollIndicator={false}
     contentContainerStyle={[
       {paddingBottom : 100},
       players.length === 0 && { flex : 1}
     ]}
     />
      <Button 
       title="Remover Turma"
       style={{backgroundColor : '#AA2834'}}
       onPress={handleGroupRemove}
      />
    </Container>
  )
}
