import React, {useMemo} from 'react';
import {SafeAreaView, Text, StyleSheet, Button} from 'react-native';
import Realm from 'realm';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

const realm = new Realm({
  schema: [{name: 'Person', properties: {name: 'string'}}],
});

if (realm.empty) {
  realm.write(() => {
    realm.create('Person', {name: 'Alice'});
    realm.create('Person', {name: 'Bob'});
    realm.create('Person', {name: 'Charlie'});
  });
}

export function App() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  const persons = useMemo(() => realm.objects<{name: string}>('Person'), []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello {persons.map(({name}) => name).join(', ')}!</Text>
      <Animated.View style={[styles.view, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  view: {width: 100, height: 80, backgroundColor: 'black', margin: 30},
});
