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

    NetInfo.fetch().then(state => {
        if(state.isConnected) {
            console.log("Connecte, execution queue")
            const jsonValue = AsyncStorage.getItem('waitingList')
            console.log(jsonValue)
        } else {
            console.log("Pas connecté, en attent..")
        }
    });


})

let process;

const Home = ({navigation, route}) => {
    const netInfo = useNetInfo();
    AsyncStorage.clear()

    const [waitingList, setWaitingList] = useState(async () => {
            const jsonValue = await AsyncStorage.getItem('waitingList')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null
        setWaitingList(data || [])
        }
    );

    async function addFileWaiting() {
        const filesss = {
            url: "testttdf test",
            type: "test",
            name: "test"
        }
        const updatedList = [...waitingList, filesss]
        console.log(updatedList)
        setWaitingList(updatedList)
        await AsyncStorage.setItem("waitingList", JSON.stringify(updatedList))
    }

    async function processFetch() {

        if(netInfo.isConnected) {

            const jsonValue = await AsyncStorage.getItem('waitingList')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null

            // TAKE THE OLDER FILE
            let file = data[0]

            // UPLOAD PROCESS


            // WHEN UPLOAD PROCESS FINISHED, RECALL THIS FUNCTION
            await processFetch()
        }

    }

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



    if(DATA && DATA.length > 0) {

        return(
            <View>
                <View>
                    <Text>Type: {netInfo.type}</Text>
                    <Text>Is Connected? {netInfo.isConnected}</Text>
                </View>
                <Button title={"CLIQUE TEST"} onPress={addFileWaiting}/>
                <Button title={"STOP"} onPress={Unregister}/>
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