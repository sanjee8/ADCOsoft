import React, {useState} from 'react'
import {View, Text, FlatList, Button} from "react-native";
import Folder from "./Folder";
import {styles} from '../styles/main'
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import {useNetInfo} from "@react-native-community/netinfo";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DATA = [
    {
        id: '1',
        title: "salut dfgfdg ",
        type: "mic"
    }
];

const TASK_NAME = "BACKGROUND_TASK"

TaskManager.defineTask(TASK_NAME, () => {

    async function processFetch() {

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

                let uri = data[0]
                console.log(uri)

                let apiUrl = 'https://rsanjeevan.fr/adcosoft.php'; // HTTPS OBLIGATOIRE
                let uriParts = uri.split('.');
                let fileType = uriParts[uriParts.length - 1];


                const datas = {
                    uri,
                    name: `recording.${fileType}`,
                    type: `audio/x-${fileType}`,
                };

                let formData = new FormData();
                formData.append('file', datas);

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

let process;

const Home = ({navigation, route}) => {
    const netInfo = useNetInfo();

    const [waitingList, setWaitingList] = useState(async () => {
            const jsonValue = await AsyncStorage.getItem('waitList')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null
        setWaitingList(data || [])
        }
    );


    let RegisterBackgroundTask = async () => {
        try {
            await BackgroundFetch.registerTaskAsync(TASK_NAME, {
                minimumInterval: 5, // seconds,
            })
            console.log("Task enregistre")

        } catch (err) {
            console.log("Task Register failed:", err)
        }
    }

    let Unregister = async () => {
        await BackgroundFetch.unregisterTaskAsync(TASK_NAME)
    }

    async function Writed() {
        const jsonValue = await AsyncStorage.getItem('@waitList')
        console.log(jsonValue)
    }


    if(DATA && DATA.length > 0) {

        return(
            <View>
                <Button title={"CLIQUE TEST"} onPress={RegisterBackgroundTask}/>
                <Button title={"STOP"} onPress={Unregister}/>
                <Button title={"GET WRITED"} onPress={Writed}/>
                <FlatList
                    data={DATA}
                    renderItem={({item, index}) => {
                        return (
                            <Folder name={item.title} navigation={navigation} index={index}/>
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