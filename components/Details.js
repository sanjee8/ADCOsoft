import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal, Image} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Audio} from "expo-av";
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import Upload from "./Upload";

const TASK_NAME = "BACKGROUND_TASK"
let interval;

const Details = ({route}) => {

    const [waitingList, setWaitingList] = useState(async () => {
            const jsonValue = await AsyncStorage.getItem('@waitList')
            const data = jsonValue != null ? JSON.parse(jsonValue) : null
            setWaitingList(data || [])
        }
    );
    const [type, setType] = useState(false);
    const [recording, setRecording] = React.useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [uri, setUri] = useState(null);
    const [recordTime, setRecordTime] = useState("0:00");
    const [replaying, setReplaying] = useState(null);
    const [image, setImage] = useState(null)


    let timer = 0;

    /**
     * Start audio recording
     * @returns null
     */
    async function startRecording() {
        try {

            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();

            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);

        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    /**
     * Stop audio recording
     * @returns null
     */
    async function stopRecording() {
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setUri(uri);

        await playRecorded(uri)
    }


    /**
     * Play recorded sound
     * @param uri
     * @returns {Promise<void>}
     */
    async function playRecorded(uri) {

        const { sound: playbackObject } = await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: false }
        );
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        await playbackObject.playAsync();
        setReplaying(playbackObject);

    }


    /**
     * Replay recorded sound
     * @returns {Promise<void>}
     */
    async function rePlayRecorded() {
        if(replaying !== null) {
            await replaying.replayAsync();
        }
    }

    /**
     * Check internet connection before upload
     * @param uri
     * @param type
     * @returns {Promise<void>}
     */
    async function uploadCheck(uri, type = true) {

        if(type) {
            cancelRecord();
        } else {
            cancelPhoto();
        }

        let connected = false;

        await NetInfo.fetch().then(state => {
            if(state.isConnected) {
                connected = true;
            }
        });

        const object_file = {dossier: route.params.id, uri: uri};

        if(connected) {
            await Upload.uploadAsync(object_file)
        } else {


            // ADD TO WAITING LIST
            const updatedList = [...waitingList, object_file]


            console.log(JSON.stringify(updatedList))


            await AsyncStorage.setItem("@waitList", JSON.stringify(updatedList))

            setWaitingList(updatedList)


            const jsonValue = await AsyncStorage.getItem('@waitList')

            try {
                await BackgroundFetch.registerTaskAsync(TASK_NAME, {
                    minimumInterval: 5, // seconds,
                })
                console.log("Task enregistre")

            } catch (err) {
                console.log("Task Register failed:", err)
            }

            console.log(jsonValue)
        }
    }


    /**
     * Start timer
     * @returns null
     */
    function initTimer(){
        interval = setInterval(
            () => handler(),
            1000
        );
    }

    /**
     * Increment timer
     * @returns null
     */
    function handler(){
        timer = timer+1;
        setRecordTime(timeFormat(timer))

    }

    /**
     * Stop recording and timer
     * @returns null
     */
    function stopRecordAudio() {
        clearInterval(interval)
        stopRecording()
    }

    /**
     * Format int to time
     * @param time
     * @returns {string}
     */
    function timeFormat(time) {
        let m = 0;
        let s;
        if(time >= 60) {
            m = Math.floor(time / 60)
            s = time - (m*60)
        } else {
            s = time
        }

        if(s < 10) {
            s = "0" + s;
        }

        return m + ":" +s;

    }

    /**
     * Buttons block in modal
     * @returns {JSX.Element}
     */
    function Buttons() {
        if(uri === null) {
            return (
                <TouchableOpacity onPress={() => stopRecordAudio()}>
                    <Text style={detail.modalBtnStop}>Arrêter l'enregistrement</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <View>
                    <TouchableOpacity onPress={() => rePlayRecorded()}>
                        <Text style={detail.modalBtnReplay}>Réécouter l'audio</Text>
                    </TouchableOpacity>

                    <Text style={detail.surText}>Êtes vous sûr de vouloir envoyer l'audio ?</Text>

                    <View style={detail.choice}>
                        <TouchableOpacity onPress={() => cancelRecord()}>
                            <Text style={detail.choiceDeny}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => uploadCheck(uri)}>
                            <Text style={detail.choiceAccept}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )
        }
    }

    /**
     * Clear recording
     * @returns null
     */
    async function cancelRecord() {
        clearInterval(interval);
        setUri(null);
        if(replaying !== null)
            replaying.stopAsync();
        setReplaying(null);
        setModalVisible(!modalVisible)
        setRecordTime("0:00");
        setRecording(undefined);
        if(recording !== undefined)
            await recording.stopAndUnloadAsync();
    }

    /**
     * Start photo import
     * @returns {Promise<void>}
     */
    async function selectPhoto() {
        setType(true)
        setModalVisible(true)
    }

    /**
     * Start recording
     * @returns null
     */
    function recordAudio() {
        setType(false)
        setModalVisible(true)
        startRecording()
        initTimer()
    }

    /**
     * Open camera
     * @returns {Promise<void>}
     */
    async function cameraPhoto() {
        const permPhoto  = ImagePicker.requestCameraPermissionsAsync()
        if(permPhoto) {

            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })

            if (!result.cancelled) {
                uploadPhoto(result.uri)
            }

        } else {
            alert("Vous devez autoriser l'application à accéder à la camera.")
        }
    }

    /**
     * Open library
     * @returns {Promise<void>}
     */
    async function libraryPhoto() {
        const permPhoto  = ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permPhoto) {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })

            if (!result.cancelled) {
                uploadPhoto(result.uri)
            }

        } else {
            alert("Vous devez autoriser l'application à accéder à la bibliothèque.")
        }
    }

    /**
     * Upload immage
     * @param uri
     */
    function uploadPhoto (uri) {
        setUri(uri)
        setImage(uri);
    }


    /**
     * Block buttons upload photos
     * @returns {JSX.Element}
     */
    function imageImporter() {
        if(image == null) {
            return (
                <View>
                    <View style={detail.choicePhoto}>
                        <TouchableOpacity onPress={() => cameraPhoto()}>
                            <Text style={detail.choicePh}>Prendre une photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => libraryPhoto()}>
                            <Text style={detail.choicePh}>Choisir dans la bibliothèque</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => cancelPhoto()}>
                            <Text style={detail.choicePh}>Annuler</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )
        } else {
            return (
                <View style={detail.photoConfirm}>
                    {image && <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />}

                    <Text style={detail.surText}>Êtes vous sûr de vouloir envoyer cette image ?</Text>

                    <View style={detail.choice}>
                        <TouchableOpacity onPress={() => cancelPhoto()}>
                            <Text style={detail.choiceDeny}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => uploadCheck(uri, false)}>
                            <Text style={detail.choiceAccept}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )

        }

    }

    /**
     * Cancel upload photo process
     */
    function cancelPhoto() {
        setImage(null);
        setModalVisible(false);
        setUri(null);
    }

    /**
     * Modal content
     * @returns {JSX.Element}
     */
    function modalContent() {
        if(type) {
            return (
                <View style={detail.modalView}>
                    <Text style={detail.modalText}><Ionicons name="image-outline" size={42}/></Text>
                    {imageImporter()}
                </View>
            )
        } else {
            return (
                <View style={detail.modalView}>
                    <Text style={detail.modalText}><Ionicons name="mic-outline" size={42}/></Text>
                    <Text style={detail.modalText}>Enregistrement en cours..</Text>
                    <Text>{recordTime}</Text>
                    {Buttons()}
                </View>
            )
        }
    }

    /**
     * Main page
     */
    return (
        <View style={{height: 675}}>

{/*            <FlatList
                data={DATA}
                renderItem={({ item }) => (
                    <Element item={item} />
                )}

                numColumns={3}
                keyExtractor={(item, index) => index}
            />*/}

            <View style={detail.textView}>
                <Text style={detail.textDetail}>
                    Utilisez les boutons en dessous pour envoyer un Audio ou une image.
                </Text>
            </View>

            <View style={detail.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                        cancelRecord()
                        cancelPhoto()
                    }}
                >
                    <View style={detail.centeredView}>
                        {modalContent()}
                    </View>
                </Modal>
                <TouchableOpacity style={detail.btn_mic} onPress={() => recordAudio()}>
                    <Text style={[modalVisible ? detail.btn_text_active : detail.btn_text]}><Ionicons name="mic-outline" size={42}/></Text>
                </TouchableOpacity>

                <TouchableOpacity style={detail.btn_photo} onPress={selectPhoto}>
                    <Text style={detail.btn_text}><Ionicons name="image-outline" size={42}/></Text>
                </TouchableOpacity>
            </View>



        </View>


    )


}

export default Details;


const detail = StyleSheet.create({
    textView: {
        margin: 50,
    },
    textDetail: {
          textAlign: 'center'
    },
    photoConfirm: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    choice: {
        flexDirection: 'row',
        justifyContent: "center"
    },
    choicePhoto: {
        flexDirection: 'column',
        justifyContent: "center"
    },
    choicePh: {
        backgroundColor: "#e8e8e8",
        padding: 10,
        width: 200,
        textAlign: "center",
        margin: 1
    },
    choiceDeny: {
        backgroundColor: "#ed6868",
        padding: 10,
        borderRadius: 3,
        margin: 20
    },
    choiceAccept: {
        backgroundColor: "#42db56",
        padding: 10,
        borderRadius: 3,
        margin: 20
    },
    surText: {
        padding: 10,
        marginTop: 10,
        textAlign: "center"
    },
    modalBtnReplay: {
        marginBottom: 15,
        textAlign: "center",
        backgroundColor: "#149db5",
        padding: 8,
        borderRadius: 5,
        margin: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalBtnStop: {
        marginBottom: 15,
        textAlign: "center",
        backgroundColor: "#149db5",
        padding: 15,
        borderRadius: 5,
        margin: 15
    },

    btn_mic: {

        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 100,
        bottom: 150,
    },
    btn_photo: {

        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: -100,
        bottom: 200,
    },
    btn_text: {
        borderRadius: 50,
        backgroundColor: "#0a7878",
        paddingHorizontal: 18,
        paddingVertical: 18,
        width: 80,
        height: 80,
        color: "white"
    },
    btn_text_active: {
        borderRadius: 50,
        backgroundColor: "#65dbf0",
        paddingHorizontal: 18,
        paddingVertical: 18,
        width: 80,
        height: 80,
        color: "white"
    }
})