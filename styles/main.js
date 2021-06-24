import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    empty_view: {
        flex: 1,
        alignItems: 'center',
        margin: 30,
    },
    empty_small_text: {
        fontSize: 11,
    },
    btn_logout: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        marginTop: 10
    },
    btn_text: {
        borderRadius: 15,
        backgroundColor: "#0a7878",
        paddingLeft: 40,
        paddingTop: 5,
        width: 160,
        height: 30,
        color: "white"
    },
});

export {styles}