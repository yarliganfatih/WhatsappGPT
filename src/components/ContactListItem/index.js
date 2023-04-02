import { Text, Image, StyleSheet, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ContactListItem = ({ item, onPressItem }) => {
  const navigation = useNavigation();

  const imgRender = (path) => {
    return path ? { uri: path } : require('../../../assets/images/profilePhoto.png')
  }

  return (
    <Pressable onPress={onPressItem} style={styles.container}>
      <Image source={imgRender(item.image)} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <Text numberOfLines={2} style={styles.subTitle}>
          {item.status}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});

export default ContactListItem;
