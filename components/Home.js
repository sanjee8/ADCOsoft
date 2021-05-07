import React from 'react'
import {View, Text, FlatList} from "react-native";
import Folder from "./Folder";
import {styles} from '../styles/main'

const DATA = [
    {
        id: '1',
        title: "salut dfgfdg ",
        type: "mic"
    }
];


const Home = ({navigation, route}) => {


        if(DATA && DATA.length > 0) {

            return(
                <View>
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