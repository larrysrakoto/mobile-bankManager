import { Image, StyleSheet, Platform, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.up}>
        <ThemedText style={styles.headTitle}>
          Bienvenu dans votre banque!
        </ThemedText>
      </View>
      <View style={styles.down}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headTitle:{
    fontSize: 28,
    color: '#fff'
  },
  up:{
    flex: 1,
    backgroundColor: '#015B94',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  down:{
    flex: 3
  }
});
