import React, {useState} from 'react'
import {  View, Text, FlatList} from "react-native";
import Folder from "./Folder";
import {styles} from '../styles/main'
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";


const TASK_NAME = "BACKGROUND_TASK"

TaskManager.defineTask(TASK_NAME, () => {

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

                let apiUrl = 'http://95.142.174.98/ADCOsoft1/?p=upload_doc'; // HTTPS OBLIGATOIRE
                let uriParts = object_file.uri.split('.');
                let fileType = uriParts[uriParts.length - 1];


                const datas = {
                    uri: object_file.uri,
                    name: `recording.${fileType}`,
                    type: `audio/x-${fileType}`,
                };

                let formData = new FormData();
                formData.append('file', datas);
                formData.append('dossier', object_file.dossier);

                let options = {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                };


                await fetch(apiUrl, options);
                await AsyncStorage.setItem("@waitList", JSON.stringify(data.slice(1)))
                console.log(JSON.stringify(data.slice(1)))

                await processFetch()
            } else {
                await BackgroundFetch.unregisterTaskAsync(TASK_NAME)
            }




        }


    }

    processFetch()




})


const Home = ({navigation}) => {


    const [dossier, setDossier] = useState(async () => {
            const jsonValue = await AsyncStorage.getItem('@auth')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null
        setDossier(data || [])
        }
    );



    if(dossier && dossier.length > 0) {


        return(
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
        )
    } else {
        return (
            <View style={styles.empty_view}>
                <Text>Vous n'avez aucun dossier rattaché à votre compte !</Text>
                <Text style={styles.empty_small_text}>Si il s'agit d'une erreur, veuillez contacter le cabinet.</Text>
            </View>
        )
    }


}

export default Home;