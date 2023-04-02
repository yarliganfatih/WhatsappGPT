import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import preContacts from '../../assets/data/contacts.json';
import ContactListItem from '../components/ContactListItem';
import SwipeableItem from '../components/Common/SwipeableItem';

const ContactsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [contacts, setContacts] = useState(preContacts);
  const _setContacts = (_contacts) => {
    AsyncStorage.setItem("@contacts", JSON.stringify(_contacts))
    setContacts(_contacts)
  }
  useEffect(() => {
    if (isFocused) {
      Promise.resolve(asyncSetContacts()).catch((e) => { throw e; });
    }
  }, [isFocused]);
  const asyncSetContacts = async() => {
    const _contacts = await AsyncStorage.getItem('@contacts')
    if (_contacts) setContacts(JSON.parse(_contacts))
    //resetContacts
  }

  const resetContacts = () => {
    _setContacts([...preContacts]);
    console.log("reset contacts");
  }
  
  const onPressItem = async({ item, index }) => {
    console.log("pressed contacts");
    let _user = item
    let _chats = await AsyncStorage.getItem('@chats')
    if (_chats) {
      _chats = JSON.parse(_chats)
      let redirectChat
      let foundIndex = _chats.findIndex(chat => chat.user.id === _user.id)
      if(foundIndex != -1){
        redirectChat = _chats[foundIndex]
      }else{
        let newChat = {
          "id": Date.now(),
          "user": _user,
          "lastMessage": {}
        }
        AsyncStorage.setItem("@chats", JSON.stringify([newChat, ..._chats]))
        redirectChat = newChat
        console.log("created chat for", _user.name)
      }
      navigation.navigate('Chat', { id: redirectChat.id, name: redirectChat.user.name })
    }
  }

  const deleteItem = ({ item, index }) => {
    console.log("deleted contacts");
    let _contacts = contacts;
    _contacts.splice(index, 1);
    _setContacts([..._contacts]);
  };

  return (
    <FlatList
      data={contacts}
      renderItem={(item) =>
        SwipeableItem(
          item, 
          ContactListItem,
          () => { onPressItem(item) },
          () => { deleteItem(item) }
        )
      }
      style={{ backgroundColor: 'white' }}
    />
  );
};

export default ContactsScreen;
