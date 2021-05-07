import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default class Element extends React.Component {

    render() {
        if(this.props.item.type === "pdf") {
            return (
                <TouchableOpacity style={element.view} onPress={() => alert("test")}>
                    <Text><Ionicons name="image-outline" size={64}/></Text>
                    <Text style={element.name}>{this.props.item.title}.pdf</Text>
                    <Text style={element.date}>03/05/2021 à 13:31</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={element.view} onPress={() => alert("test")}>
                    <Text><Ionicons name="mic-outline" size={64}/></Text>
                    <Text style={element.name}>Audio</Text>
                    <Text style={element.date}>03/05/2021 à 13:31</Text>
                </TouchableOpacity>
            )
        }
    }

}

const element = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'column',
        margin: 1,
        maxWidth: 130,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontWeight: "bold",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        margin: 0,
        padding: 0,
        flexBasis: 250,
        color: "#708090",
        fontSize: 12,
        fontWeight: "normal"
    },
    date: {
        fontSize: 12,
    }
})