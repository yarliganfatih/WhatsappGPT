import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './src/navigation';
import { useTheme } from 'react-native-paper';

export default function App() {
  const theme = useTheme();
  console.log("theme.colors.background", theme.colors.background)
  const containerStyle = [
    styles.container,
    {
      backgroundColor: 'blue'
    },
  ];

  return (
    <View style={containerStyle}>
      <Navigator />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
});
