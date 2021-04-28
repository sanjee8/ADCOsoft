import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import Home from "./components/Home";

const PageStack = createStackNavigator();

export default function App() {
  return (
      <View style={{flex:1}}>

        <NavigationContainer>
          <PageStack.Navigator>
            <PageStack.Screen name="Login" component={Login} options={{title: "Se connecter"}}/>
            <PageStack.Screen name="Home" component={Home} options={{title: "Vos dossiers"}}/>
          </PageStack.Navigator>
        </NavigationContainer>
      </View>
  );
}
