import { Text, View, Image, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatListItem = ({ item, onPressItem }) => {
  const navigation = useNavigation();

  const imgRender = (path) => {
    return path ? { uri: path } : require('../../../assets/images/profilePhoto.png')
  }

  return (
    <RectButton
      onPress={onPressItem}
      style={styles.container}
    >
      <Image source={imgRender(item.user.image)} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {item.user.name}
          </Text>
          <Text style={styles.subTitle}>{dayjs(item.lastMessage.createdAt).fromNow(true)}</Text>
        </View>

        <Text numberOfLines={2} style={styles.subTitle}>
          {item.lastMessage.content}
        </Text>
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray',
  },
});

export default ChatListItem;
