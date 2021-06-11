import React, {useState} from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from "./components/Login";
import Home from "./components/Home";
import Details from "./components/Details";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PageStack = createStackNavigator();



export default function App() {

    const [isSignedIn, setSigned] = useState(async () => {
        const jsonValue = await AsyncStorage.getItem('@connected')
        const data = jsonValue != null ? JSON.parse(jsonValue) : null
        console.log(data)
        setSigned(data || false)
    })

    return (
            <View style={{flex:1}}>

                <NavigationContainer>
                    {
                        isSignedIn ? (
                            <PageStack.Navigator>
                                <PageStack.Screen name="Home" component={Home} options={{title: "Vos dossiers"}} />
                                <PageStack.Screen name="Details" component={Details} options={({ route }) => ({ title: route.params.name })}/>
                            </PageStack.Navigator>
                        ) : (
                            <PageStack.Navigator>
                                <PageStack.Screen name="Login" options={{title: "Se connecter"}} >
                                    {() => <Login isSigned={setSigned} />}
                                </PageStack.Screen>
                            </PageStack.Navigator>
                        )
                    }
                </NavigationContainer>
            </View>
    );
}
