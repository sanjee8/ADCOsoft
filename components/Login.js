import React from 'react'
import {View, Text, TextInput, TouchableOpacity} from "react-native";
import {styles} from '../styles/auth'

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: null,
            code: null,
            err_mail: null,
            err_code: null
        };
    }



    isMailError() {
        return this.state.err_mail !== null;
    }


    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.main_text}>Se connecter</Text>

                <View style={[styles.input_view, this.isMailError() && styles.input_v_err ]} >
                    <TextInput
                        style={styles.input_text}
                        placeholder="Adresse mail.."
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({err_mail:text})}/>
                </View>
                <View style={styles.input_view} >
                    <TextInput
                        style={styles.input_text}
                        placeholder="Code d'accès.."
                        placeholderTextColor="#003f5c"
                        onChangeText={text => this.setState({code:text})}
                        secureTextEntry />
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgot_link}>Vous n'arrivez pas à vous connecter ?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.login_button}>
                    <Text style={styles.login_text}>Se connecter</Text>
                </TouchableOpacity>

            </View>
        )
    }

}