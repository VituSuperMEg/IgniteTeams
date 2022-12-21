import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Highlight } from "../../components/HighLight";
import { Input } from "../../components/Input";
import { Container, Content, Icon } from "./style";
import { useNavigation} from '@react-navigation/native'
import { useState } from "react";
import { groupCreate } from "../../storage/group/groupCreate";
import { AppError } from "../../utils/appError";
import { Alert } from 'react-native';

export function NewGroup(){
   

  const [ group , setGroup ] = useState('');

  const nagivation = useNavigation();
  
  async function handleNew(){
    try {
      if(group.trim().length === 0){
        return Alert.alert('Novo Grupo', 'Informe um nome da turma')
      }
      await groupCreate(group)
      nagivation.navigate('players', { group });

    } catch (error) {
      if(error instanceof AppError){
         Alert.alert('Novo grupo', error.message);
      }else{
        Alert.alert('Novo grupo', 'Não foi possível criar um novo grupo');
        console.log(error);
      }
    
    }
  }
  return(
   <Container>
      <Header showBackButton />

      <Content>
          <Icon />
          <Highlight 
            title="Nova turma"
            subtitle="crie a turma para adicionar as pessoas"
          />
          <Input 
           placeholder="Nome da turma"
           onChangeText={setGroup}
          />
          <Button 
          style={{marginTop : 20}}
          title="Criar" onPress={handleNew}/>
      </Content>
   </Container>
  )
 
}