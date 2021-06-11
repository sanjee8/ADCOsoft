import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Details from "./Details";



export default class Folder extends React.Component {

    details() {
        this.props.navigation.navigate("Details", { name: this.props.name, id: this.props.id })
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.details()} style={folder.view}>
                <Text style={folder.name}>{this.props.name}</Text>
                <Text><Ionicons name="chevron-forward-outline" size={24}/></Text>
            </TouchableOpacity>
        )
    }

}

const folder = StyleSheet.create({
    view: {
        backgroundColor: '#EEEEEE',
        borderWidth: 1,
        borderColor: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontWeight: "bold",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        flexBasis: 250,
        color: "#708090",
        fontSize: 18,
        fontWeight: "normal"
    }
})