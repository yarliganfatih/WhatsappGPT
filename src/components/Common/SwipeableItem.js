import { TouchableOpacity, Text } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

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
            <TouchableOpacity 
                style={{
                    margin: 0,
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: 100,
                    backgroundColor: "red",
                    marginVertical: 5,
                }}
                onPress={__deleteItem}
            >
                <Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>DELETE</Text>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, _deleteItem)
                }
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
                rightOpenValue={-100}>
                <Component item={item} onPressItem={_onPressItem} />
            </Swipeable>
        </GestureHandlerRootView>
    );
};

export default renderItem;