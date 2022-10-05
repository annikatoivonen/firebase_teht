import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

 const firebaseConfig = {
  apiKey: "AIzaSyAsFUqQwZzf1sqIk6X5tLXHdIGqmpBB1Uo",
  authDomain: "test-app-78a81.firebaseapp.com",
  projectId: "test-app-78a81",
  storageBucket: "test-app-78a81.appspot.com",
  messagingSenderId: "119912531762",
  appId: "1:119912531762:web:2c41f789f24fc95395b92b"
};

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);


export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'list/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      
      const stuff = data ? Object.keys(data).map(key => ({key, ...data[key]})) : [];
      setList(stuff);
    })
  }, []);

  const saveItem = () => {  
    push(ref(database, 'list/'),
  { 'product': product, 'amount': amount });
}

 const deleteItem = (item) => {
   console.log(item);
   remove(ref(database, 'list/'+item.key))
}

const listSeparator = () => {
  return(
    <View
    style={{
      height: 5,
      width: '80%',
      backgroundColor: '#fff',
      marginLeft: '10%',
    }}>
    </View>
  )
}

  return (
    <View style={styles.container}>
      <View style={{flex:1, justifyContent:'center'}}>
        <TextInput
        style={styles.input}
        placeholder="Product"
        onChangeText={setProduct}
        value={product}>
        </TextInput>
        <TextInput
        style={styles.input}
        placeholder="Amount"
        onChangeText={setAmount}
        value={amount}>
        </TextInput>
        <Button
        title="SAVE"
        onPress={saveItem}>
        </Button>
      </View>
      <View style={{flex: 2}}>
        <Text style={{fontSize:24}}>Shopping list</Text>
        <FlatList
          keyExtractor={item => item.key}
          renderItem={({item}) =>
          <View style={{flexDirection:'row'}}>
          <Text>{item.product}, {item.amount}</Text>
          <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item)}> delete</Text>
          </View>}
          data={list}
          ItemSeparatorComponent={listSeparator}
          />
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1, 
    width: 250,
    padding: 10,
    margin: 12,
  },
});
