import React from "react";

export default class Upload extends React.Component {

    /**
     *
     * @param object_file
     * @returns {Promise<void>}
     */
    static async uploadAsync(object_file) {

        let apiUrl = 'http://95.142.174.98/ADCOsoft1/adcosoft.php'; // HTTPS OBLIGATOIRE
        let uriParts = object_file.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];


        let data;
        if(fileType === "jpg") {
            data = {
                uri : object_file.uri,
                name: `image.${fileType}`,
                type: `image/jpeg`
            };
        } else {
            data = {
                uri : object_file.uri,
                name: `audio.${fileType}`,
                type: `audio/x-${fileType}`
            };
        }


        let formData = new FormData();
        formData.append('file', data);
        formData.append('dossier', object_file.dossier)

        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        let response = await fetch(apiUrl, options);

        let json = await response.json();

        if(json[0] === true) {
            console.log("File uploaded")
        } else {
            alert(json[1])
        }
        console.log(json)

    }

}