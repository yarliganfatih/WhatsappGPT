import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter, FlatList } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import preChats from '../../assets/data/chats.json';
import ChatListItem from '../components/ChatListItem';
import SwipeableItem from '../components/Common/SwipeableItem';

// for the listener to be defined only once
let globalListenerParams;
DeviceEventEmitter.addListener("event.addChat", (_eventData) => {
  globalListenerParams = {
    event: "addChat",
    eventData: _eventData
  }
})
// when listener is inside the functional component, it is called more than once

const ChatsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [chats, setChats] = useState(preChats);

  useEffect(() => {
    Promise.resolve(asyncSetChats()).catch((e) => { throw e; });
  }, []);

  const asyncSetChats = async() => {
    const _chats = await AsyncStorage.getItem('@chats')
    if (_chats) setChats(JSON.parse(_chats))
    //resetChats()
  }

  const resetChats = () => {
    setChats([...preChats]);
    console.log("reset chats");
  }

  useEffect(() => {
    AsyncStorage.setItem(
      '@chats',
      JSON.stringify(chats),
    );
    console.log("updated chats", chats[0])
    if(preChats != chats){
      setChats(chats.sort((a, b) => {
        let keyA = new Date(a.lastMessage.createdAt);
        let keyB = new Date(b.lastMessage.createdAt);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      }));
    }
  }, [chats]);

  const onPressItem = ({ item, index }) => {
    navigation.navigate('Chat', { updateChats: updateChats, id: item.id, name: item.user.name });
  }

  const deleteItem = ({ item, index }) => {
    let _chats = chats;
    _chats.splice(index, 1);
    setChats([..._chats]);
    console.log("deleted chat");
    // No deleting messages, remains in memory
  };

  const updateChats = ( _id, _lastMessage ) => {
    let _chats = chats;
    let foundIndex = _chats.findIndex(chat => chat.id === _id)
    if(foundIndex != -1){
      _chats[foundIndex].lastMessage = _lastMessage;
      setChats([..._chats]);
      console.log("updated chat");
    }
  }

  useEffect(() => {
    if (isFocused) {
      console.log('focused ChatsScreen');
      if(globalListenerParams){
        if(globalListenerParams.event=="addChat"){
          console.log('call addChat with', globalListenerParams.eventData.param);
          addChat(globalListenerParams.eventData.param)
        }
      }
      globalListenerParams = null;
    }
  }, [isFocused]);

  const addChat = ( _user ) => {
    if(!_user){
      return 0;
    }
    let _chats = chats;
    let foundIndex = _chats.findIndex(chat => chat.user.id === _user.id)
    let redirectChat;
    if(foundIndex != -1){
      redirectChat = _chats[foundIndex]
    }else{
      let newChat = {
        "id": Date.now(),
        "user": _user,
        "lastMessage": {}
      }
      setChats([newChat, ..._chats])
      redirectChat = newChat
      console.log("created chat for", _user.name)
    }
    console.log("redirectChat", redirectChat)
    // onPressItem(redirectChat) // TODO Occured error because the chats cannot be fully updated
  }

  return (
    <FlatList
      data={chats}
      renderItem={(item) =>
        SwipeableItem(
          item, 
          ChatListItem,
          () => { onPressItem(item) },
          () => { deleteItem(item) }
        )
      }
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: 'white' }}
    />
  );
};

export default ChatsScreen;
