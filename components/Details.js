import React, {useState} from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Modal} from "react-native";
import Element from "./Element";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Audio} from "expo-av";
import * as FileSystem from "expo-file-system";


const DATA = [
    {
        id: '1',
        title: "salut dfgfdg ",
        type: "pdf"
    },
    {
        id: '1',
        title: "salut dfgfdg ",
        type: "mic"
    },
    {
        id: '1',
        title: "salut dfgfdg ",
        type: "mic"
    },
    {
        id: '1',
        title: "salut dfgfdg ",
        type: "pdf"
    },
];


let interval;

const Details = ({navigation, route}) => {


    const [recording, setRecording] = React.useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [uri, setUri] = useState(null);
    const [recordTime, setRecordTime] = useState("0:00");
    const [replaying, setReplaying] = useState(null);


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
     * Upload recorded sound
     * @param uri
     * @returns {Promise<void>}
     */
    async function uploadAudioAsync(uri) {

        let apiUrl = 'https://rsanjeevan.fr/adcosoft.php'; // HTTPS OBLIGATOIRE
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];


        const data = {
            uri,
            name: `recording.${fileType}`,
            type: `audio/x-${fileType}`,
        };

        let formData = new FormData();
        formData.append('file', data);

        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };


        await fetch(apiUrl, options);

        await cancelRecord();
    }

    /**
     * Start recording
     * @returns null
     */
    function recordAudio() {
        setModalVisible(true)
        startRecording()
        initTimer()
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

                        <TouchableOpacity onPress={() => uploadAudioAsync(uri)}>
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


    return (
        <View style={{height: 675}}>

            <FlatList
                data={DATA}
                renderItem={({ item }) => (
                    <Element item={item} />
                )}

                numColumns={3}
                keyExtractor={(item, index) => index}
            />

            <View style={detail.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                        cancelRecord()
                    }}
                >
                    <View style={detail.centeredView}>
                        <View style={detail.modalView}>
                            <Text style={detail.modalText}><Ionicons name="mic-outline" size={42}/></Text>
                            <Text style={detail.modalText}>Enregistrement en cours..</Text>
                            <Text>{recordTime}</Text>
                            {Buttons()}
                        </View>
                    </View>
                </Modal>

            </View>

            <TouchableOpacity style={detail.btn_mic} onPress={() => recordAudio()}>
                <Text style={[modalVisible ? detail.btn_text_active : detail.btn_text]}><Ionicons name="mic-outline" size={42}/></Text>
            </TouchableOpacity>

            <TouchableOpacity style={detail.btn_photo}>
                <Text style={detail.btn_text}><Ionicons name="image-outline" size={42}/></Text>
            </TouchableOpacity>
        </View>


    )


}

export default Details;

const detail = StyleSheet.create({
    choice: {
        flexDirection: 'row',
        justifyContent: "center"
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
        marginTop: 10
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
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 100,
        bottom: 30,
    },
    btn_photo: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 250,
        bottom: 30,
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