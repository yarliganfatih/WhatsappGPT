import { View, Button } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

let row: Array<any> = [];
let prevOpenedRow;

const renderItem = ({ item, index }, Component, _onPressItem, _deleteItem) => {
    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    };

    const renderRightActions = (progress, dragX, __deleteItem) => {
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
                <Button color="white" onPress={__deleteItem} title="DELETE"></Button>
            </View>
        );
    };

    return (
        <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, _deleteItem)
            }
            onSwipeableOpen={() => closeRow(index)}
            ref={(ref) => (row[index] = ref)}
            rightOpenValue={-100}>
            <Component item={item} onPressItem={_onPressItem} />
        </Swipeable>
    );
};

export default renderItem;