import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { FlatList, View, Button } from 'react-native';
import preChats from '../../assets/data/chats.json';
import ChatListItem from '../components/ChatListItem';

const ChatsScreen = () => {
  const [chats, setChats] = useState(preChats);
  let row: Array<any> = [];
  let prevOpenedRow;

  useEffect(() => {
    Promise.resolve(asyncSetChats()).catch((e) => { throw e; });
  }, []);

  const asyncSetChats = async() => {
    const _chats = await AsyncStorage.getItem('@chats')
    if (_chats) {
      setChats(JSON.parse(_chats));
    }
  }

  useEffect(() => {
    if(preChats != chats){
      setChats(chats.sort((a, b) => {
        let keyA = new Date(a.lastMessage.createdAt);
        let keyB = new Date(b.lastMessage.createdAt);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      }));
      AsyncStorage.setItem(
        '@chats',
        JSON.stringify(chats),
      );
    }
  }, [chats]);

  
  const renderItem = ({ item, index }, onClick) => {
    //
    const closeRow = (index) => {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = (progress, dragX, onClick) => {
      return (
        <View
          style={{
            margin: 0,
            alignContent: 'center',
            justifyContent: 'center',
            width: 100,
            backgroundColor: "red",
            marginVertical: 5,
          }}>
          <Button color="white" onPress={onClick} title="DELETE"></Button>
        </View>
      );
    };

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, onClick)
        }
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
        rightOpenValue={-100}>
        <ChatListItem chat={item} updateChats={updateChats} />
      </Swipeable>
    );
  };

  const deleteItem = ({ item, index }) => {
    console.log("deleted chat");
    let _chats = chats;
    _chats.splice(index, 1);
    setChats([..._chats]);
    // No deleting messages, remains in memory
  };

  const updateChats = ( _id, _lastMessage ) => {
    console.log("updated chat");
      let _chats = chats;
      let foundIndex = _chats.findIndex(chat => chat.id === _id)
      if(foundIndex != -1){
        _chats[foundIndex].lastMessage = _lastMessage;
        setChats([..._chats]);
      }
  }

  return (
    <FlatList
      data={chats}
      renderItem={(v) =>
        renderItem(v, () => {
          deleteItem(v);
        })
      }
      keyExtractor={(item) => item.id}
      style={{ backgroundColor: 'white' }}
    />
  );
};

export default ChatsScreen;
