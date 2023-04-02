import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import preChats from '../../assets/data/chats.json';
import ChatListItem from '../components/ChatListItem';
import SwipeableItem from '../components/Common/SwipeableItem';

const ChatsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [chats, setChats] = useState(preChats);
  const _setChats = (_chats) => {
    AsyncStorage.setItem("@chats", JSON.stringify(_chats))
    setChats(_chats)
  }
  useEffect(() => {
    if (isFocused) {
      Promise.resolve(asyncSetChats()).catch((e) => { throw e; });
    }
  }, [isFocused]);
  const asyncSetChats = async() => {
    const _chats = await AsyncStorage.getItem('@chats')
    if (_chats) setChats(JSON.parse(_chats))
    //resetChats()
  }

  const resetChats = () => {
    _setChats([...preChats]);
    console.log("reset chats");
  }

  useEffect(() => {
    if(preChats != chats){
      _setChats(chats.sort((a, b) => {
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
    _setChats([..._chats]);
    console.log("deleted chat");
    // No deleting messages, remains in memory
  };

  const updateChats = ( _id, _lastMessage ) => {
    let _chats = chats;
    let foundIndex = _chats.findIndex(chat => chat.id === _id)
    if(foundIndex != -1){
      _chats[foundIndex].lastMessage = _lastMessage;
      _setChats([..._chats]);
      console.log("updated chat");
    }
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
