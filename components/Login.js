import React from 'react'
import {View, Text, TouchableOpacity, TextInput} from "react-native";
import {styles} from '../styles/auth'
import PhoneInput from "react-native-phone-number-input";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            phone: null,
            email: null,
            response: null,
            loading: false,
            formatted: null
        };
    }

    async submit() {

        if(!this.phoneInput.isValidNumber(this.state.phone)) {
            this.setState({response: this.response_error("Le numéro est incorrecte !")})
        } else {
            if(this.state.email !== null) {

                console.log("connection...")


                this.setState({response: null, loading: true})

                console.log(JSON.stringify({
                    number: this.state.formatted,
                    email: this.state.email
                }));


                const formData = new FormData();
                formData.append("number", this.state.formatted);
                formData.append("email", this.state.email);

                let options = {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                };
                let response = await fetch('http://95.142.174.98/ADCOsoft1/?p=login_app', options)

                let json = await response.json();


                console.log(json)
                if(!json[0]) {
                    this.setState({loading: false, response: this.response_error(json[1])})
                } else {


                    await AsyncStorage.setItem("@connected", JSON.stringify(json[0]))
                    await AsyncStorage.setItem("@auth", JSON.stringify(json[1]))
                    this.props.isSigned(true)

                }


            } else {
                this.setState({response: this.response_error("Adresse mail incorrecte !")})
            }
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
                        onChangeFormattedText={(text) => {
                            this.setState({formatted: text});
                        }}
                        defaultCode="FR"
                        layout="first"
                        withDarkTheme
                        withShadow
                        autoFocus
                        placeholder="Numéro de téléphone"
                        disabled={this.state.loading}
                    />


                    <View style={styles.input_view}>
                        <TextInput
                            style={styles.input_text}
                            placeholder="Adresse e-mail"
                            onChangeText={(text) => {
                                this.setState({email: text});
                            }}
                            editable={!this.state.loading}
                        />
                    </View>



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