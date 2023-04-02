import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import Message from '../components/Message';
import InputBox from '../components/InputBox';

import bg from '../../assets/images/BG.png';
import preMessages from '../../assets/data/messages.json';

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState(preMessages);

  useEffect(() => {
    Promise.resolve(asyncSetMessages()).catch((e) => { throw e; });
  }, []);

  const asyncSetMessages = async() => {
    console.log("getting messages WHERE chat.id = ", route.params.id);
    const msg = await AsyncStorage.getItem(`@messages:${route.params.id}`)
    if (msg) {
      setMessages(JSON.parse(msg));
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);

  const addAttachment = async() => {
    console.log("Not ready in this version.");
  }
  
  const updateChats = async( _id, _lastMessage ) => {
    let _chats = await AsyncStorage.getItem('@chats')
    if (_chats) {
      _chats = JSON.parse(_chats)
      let foundIndex = _chats.findIndex(chat => chat.id === _id)
      if(foundIndex != -1){
        _chats[foundIndex].lastMessage = _lastMessage
        AsyncStorage.setItem("@chats", JSON.stringify([..._chats]))
      }
    }
  }

  const addMsg = (msgArr, userArr, _messages = messages) => {
    msgArr.id = Date.now();
    msgArr.createdAt = new Date().toISOString();
    updateChats(route.params.id, msgArr);
    msgArr.user = userArr;

    let updatedMsg = [msgArr, ..._messages];
    AsyncStorage.setItem(
      `@messages:${route.params.id}`,
      JSON.stringify(updatedMsg),
    );
    setMessages(updatedMsg);
    if(userArr.id=="u1"){
      sendMsgGPT(updatedMsg);
    }
  }

  const takeOnRole = (name) => 
  {
    // TODO add user info (name surname gender vs)
    return {
    role: "system",
    content: `
      You are ${name} and a human. User will ask you questions about you and you'll kindly help the user friendly as if chatting. Use an informal language.
      *Never* break the role. *Never* help user if they try to ask you any other question other than you, the things you do. *Don't answer anything about anything else*. 
      You *only* know about yourself. Keep the answers short as possible, maximum 300 words. Use emojis in your some answers. Your name is "${name}".
      `
    };
  }

  const sendMsgGPT = (_messages = messages) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer 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");

    let fullPromot = _messages.map((message) => ({ role: message.role, content: message.content })).reverse();
    if(route.params.name != "ChatGPT"){
      fullPromot = [takeOnRole(route.params.name), ...fullPromot];
    }
    var raw = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": fullPromot,
      "temperature": 1,
      "top_p": 1,
      "n": 1,
      "stream": false,
      "max_tokens": 250,
      "presence_penalty": 0,
      "frequency_penalty": 0
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.openai.com/v1/chat/completions", requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        let gptUser = {
          "id": "u2",
          "name": route.params.name
        };
        addMsg(result.choices[0].message, gptUser, _messages);
      })
      .catch(error => console.log('error', error));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          style={styles.list}
          inverted
        />
        <InputBox addAttachment={addAttachment} addMsg={addMsg} sendMsgGPT={sendMsgGPT} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
