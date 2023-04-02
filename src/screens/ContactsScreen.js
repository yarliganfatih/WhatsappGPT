import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import preContacts from '../../assets/data/contacts.json';
import ContactListItem from '../components/ContactListItem';
import SwipeableItem from '../components/Common/SwipeableItem';

const ContactsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [contacts, setContacts] = useState(preContacts);

  useEffect(() => {
    Promise.resolve(asyncSetContacts()).catch((e) => { throw e; });
  }, []);

  const asyncSetContacts = async() => {
    const _contacts = await AsyncStorage.getItem('@contacts')
    if (_contacts) setContacts(JSON.parse(_contacts))
    //resetContacts
  }

  const resetContacts = () => {
    setContacts([...preContacts]);
    console.log("reset contacts");
  }

  useEffect(() => {
    if(preContacts != contacts){
      AsyncStorage.setItem(
        '@contacts',
        JSON.stringify(contacts),
      );
      console.log("updated contacts")
    }
  }, [contacts]);
  
  const onPressItem = async({ item, index }) => {
    console.log("pressed contacts");
  }

  const deleteItem = ({ item, index }) => {
    console.log("deleted contacts");
    let _contacts = contacts;
    _contacts.splice(index, 1);
    setContacts([..._contacts]);
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
