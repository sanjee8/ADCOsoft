import React from 'react'
import {View, Text, TouchableOpacity} from "react-native";
import {styles} from '../styles/auth'
import PhoneInput from "react-native-phone-number-input";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            response: null
        };
    }

    submit() {

        if(!this.phoneInput.isValidNumber(this.state.phone)) {
            this.setState({response: this.response_error("Le numéro est incorrecte !")})
        } else {
            this.setState({response: null})
            global.isSignedIn = true;
        }

    }

    response_success(text) {
        return(
            <Text style={styles.success}>
                {text}
            </Text>
        )
    }

    response_error(text) {
        return(
            <Text style={styles.error}>
                {text}
            </Text>
        )
    }



    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.main_text}>Authentification</Text>

                <View>
                    {this.state.response}
                </View>


                    <PhoneInput
                        ref={input => {
                            this.phoneInput = input
                        }}
                        onChangeText={(text) => {
                            this.setState({phone: text});
                        }}
                        defaultCode="FR"
                        layout="first"
                        withDarkTheme
                        withShadow
                        autoFocus
                        placeholder="Numéro de téléphone"
                    />

                <TouchableOpacity>
                    <Text style={styles.forgot_link}>Vous n'arrivez pas à vous connecter ?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.submit()} style={styles.login_button}>
                    <Text style={styles.login_text}>Se connecter</Text>
                </TouchableOpacity>

            </View>
        )
    }

}