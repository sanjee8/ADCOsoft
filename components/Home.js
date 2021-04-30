import React from 'react'
import {View, Text, FlatList} from "react-native";
import Folder from "./Folder";
import {styles} from '../styles/main'

const DATA = [
    {
        id: '1',
        title: 'Dossier n1',
    },
    {
        id: '2',
        title: 'Dossier n2',
    },
    {
        id: '3',
        title: 'Dossier n3',
    },
    {
        id: '4',
        title: 'Dossier n4',
    },
    {
        id: '5',
        title: 'Dossier n5',
    },
    {
        id: '6',
        title: 'Dossier n6',
    },
    {
        id: '7',
        title: 'Dossier n7',
    },
    {
        id: '8',
        title: 'Dossier n8',
    },
    {
        id: '9',
        title: 'Dossier n9',
    },
    {
        id: '10',
        title: 'Dossier n10',
    },
    {
        id: '11',
        title: 'Dossier n11',
    },
    {
        id: '12',
        title: 'Dossier n12',
    },
    {
        id: '13',
        title: 'Dossier n13',
    },
    {
        id: '14',
        title: 'Dossier n14',
    },
    {
        id: '15',
        title: 'Dossier n15',
    },
];


export default class Home extends React.Component {



    render() {
        if(DATA && DATA.length > 0) {
            return(
                <View>
                    <FlatList
                        data={DATA}
                        renderItem={({item, index}) => {
                            return (
                                <Folder name={item.title} />
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

}