import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import Home from "./components/Home";
import Details from "./components/Details";

const PageStack = createStackNavigator();
let isSignedIn = true;

export default function App() {

    return (
        <View style={{flex:1}}>

            <NavigationContainer>
                {
                    isSignedIn ? (
                        <PageStack.Navigator>
                            <PageStack.Screen name="Home" component={Home} options={{title: "Vos dossiers"}}/>
                            <PageStack.Screen name="Details" component={Details} options={{title: "Mon dossier"}}/>
                        </PageStack.Navigator>
                    ) : (
                        <PageStack.Navigator>
                            <PageStack.Screen name="Login" component={Login} options={{title: "Se connecter"}}/>
                        </PageStack.Navigator>
                    )
                }
            </NavigationContainer>
        </View>
    );
}
