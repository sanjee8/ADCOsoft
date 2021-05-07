import * as React from 'react';
import {Button, View} from 'react-native';
import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';

const Record = ({navigation, route}) => {

    const [recording, setRecording] = React.useState();

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();

            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }


    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);


        console.log('Lunch')
        const info = await FileSystem.getInfoAsync(recording.getURI() || "");
        console.log(`FILE INFO: ${JSON.stringify(info)}`);


        console.log("const sound")
        const sound = await recording.createNewLoadedSoundAsync(
            {
                isLooping: true,
                isMuted: false,
                volume: 1,
                rate: 1,
            }
        );

        await playRecorded(uri)
        // await console.log(uploadAudioAsync(uri))
    }


    async function playRecorded(uri) {

        const { sound: playbackObject } = await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: false }
        );
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        await playbackObject.playAsync();

    }



    async function uploadAudioAsync(uri) {

        console.log("Uploading " + uri);
        let apiUrl = 'https://rsanjeevan.fr/adcosoft.php'; // HTTPS OBLIGATOIRE
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        console.log(fileType)

        const data = {
            uri,
            name: `recording.${fileType}`,
            type: `audio/x-${fileType}`,
        };

        let formData = new FormData();
        formData.append('file', data);

        console.log(formData)

        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        console.log("POSTing " + uri + " to " + apiUrl);
        return fetch(apiUrl, options);
    }



    return (
        <View>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            />
        </View>
    );
}

export default Record;