import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    main_text:{
        fontWeight:"bold",
        fontSize:50,
        color:"#37c4c4",
        marginBottom:20
    },
    input_view: {
        width:"80%",
        backgroundColor:"#ddebeb",
        borderRadius:10,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    input_v_err: {
        backgroundColor: "red"
    },
    input_text: {
        height:50,
        color:"black"
    },
    forgot_link: {
        color: '#869191',
        fontSize:11
    },
    login_button:{
        width:"70%",
        backgroundColor:"#0a7878",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10,
    },
    login_text: {
        color: 'white'
    }
});

export {styles}