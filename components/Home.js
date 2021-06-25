import React, {useState} from 'react'
import {View, Text, FlatList, TouchableOpacity} from "react-native";
import Folder from "./Folder";
import {styles} from '../styles/main'
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Upload from "./Upload";


const TASK_NAME = "BACKGROUND_TASK"

TaskManager.defineTask(TASK_NAME, () => {
    /**
     * Loop connection check and upload
     * @returns {Promise<void>}
     */
    async function processFetch() {

        console.log("PROCESS UPLOAD")

        let connected = false;
        await NetInfo.fetch().then(state => {
            if(state.isConnected) {
                connected = true
            }
        });

        if(connected) {

            const jsonValue = await AsyncStorage.getItem('@waitList')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null

            if(data && data.length) {

                let object_file = data[0]
                console.log(object_file.uri)

                await Upload.uploadAsync(object_file);


                await AsyncStorage.setItem("@waitList", JSON.stringify(data.slice(1)))
                console.log(JSON.stringify(data.slice(1)))

                await processFetch()
            } else {
                await BackgroundFetch.unregisterTaskAsync(TASK_NAME)
            }




        }


    }

    /**
     * Call
     */
    processFetch()




})


const Home = ({deco,navigation}) => {

    /**
     * Disconnect user
     * @returns {Promise<void>}
     */
    async function logout() {

        await AsyncStorage.setItem("@connected", JSON.stringify(false));
        await AsyncStorage.setItem("@auth", JSON.stringify(null))
        deco(false)

    }

    /**
     * Get dossiers
     */
    const [dossier, setDossier] = useState(async () => {
            const jsonValue = await AsyncStorage.getItem('@auth')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null
        setDossier(data || [])
        }
    );


    if(dossier && dossier.length > 0) {

        /**
         * List dossiers
         */
        return(
            <View>
                <View>
                    <FlatList
                        data={dossier}
                        renderItem={({item, index}) => {
                            return (
                                <Folder name={item.name} id={item.id} navigation={navigation} index={index}/>
                            )
                        }}
                    />
                </View>

                <View>
                    <TouchableOpacity style={styles.btn_logout} onPress={logout}>
                        <Text style={styles.btn_text}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        /**
         * Empty dossier
         */
        return (
            <View>
                <View style={styles.empty_view}>
                    <Text>Vous n'avez aucun dossier rattaché à votre compte !</Text>
                    <Text style={styles.empty_small_text}>Si il s'agit d'une erreur, veuillez contacter le cabinet.</Text>
                </View>
                <View>
                    <TouchableOpacity style={styles.btn_logout} onPress={logout}>
                        <Text style={styles.btn_text}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }


}

export default Home;