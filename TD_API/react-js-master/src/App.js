/* ROOT Component of your App  */

import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import defaultPicture from './components/img/default.jpg'

const Materialize = window.Materialize

const APP_TITLE = 'Awesome App'
//update document title (displayed in the opened browser tab)
document.title = APP_TITLE

//web api utils
import { get, ENDPOINTS } from './utils/api'

//components
import WeatherCard from './components/WeatherCard'

class App extends Component {

    /* React state initialization DOCUMENTATION : https://facebook.github.io/react/docs/react-without-es6.html#setting-the-initial-state */

    constructor( props ) {
        super( props )
        this.state = {
            weather: undefined,
            city: ''
        }
    }


    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>{ APP_TITLE }</h1>
                    <img src={ logo } className="App-logo" alt="logo" />
                </div>

                <div className="App-content">
                    <div className="center-align">

                        <form onSubmit={ this.fetchWeather }>

                            <div className="row" style={ { marginBottom: 0 } }>
                                <div className="input-field col s6 offset-s3">
                                    <input id="cityInput" type="text" value={ this.state.city } onChange={ this.handleChange } />
                                    <label htmlFor="cityInput">City</label>
                                </div>
                            </div>

                            <button type="submit" className="waves-effect waves-light btn">
                                Weather?
                            </button>

                        </form>

                    </div>

                    <div className="row" style={ { marginTop: 20 } } >
                        <div className="col s12 m6 offset-m3">
                            { this.displayWeatherInfo() }
                        </div>
                    </div>
                </div>

            </div>
        )
    }



    handleChange = ( event ) => {
        this.setState( {
            city: event.target.value
        } )
    }


    //method triggered by onSubmit event of the form or by onClick event of the "Weather?" button
    /* Arrow function syntax used for Autobinding, see details here : https://facebook.github.io/react/docs/react-without-es6.html#autobinding */
    fetchWeather = async ( event ) => {

        event.preventDefault()

        /* ASYNC - AWAIT DOCUMENTATION : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/await */

        try {
            let weather = await get( ENDPOINTS.WEATHER_API_URL, {
                //YOU NEED TO PROVIDE YOUR "APIXU" API KEY HERE, see /utils/api.js file to grab the DOCUMENTATION file
                key: '07fb607594c34e5b9ca213416172302',
                q: this.state.city
            } )

            //checking that we received a well-formated weather object
            if ( weather.current ) {
                //weather data is now received from the server thanks to async-await
                let updatedWeatherWithImage = await this.fetchPicture( weather )

                /* React state DOCUMENTATION : https://facebook.github.io/react/docs/lifting-state-up.html */
                this.setState( {
                    weather: updatedWeatherWithImage
                } )
            }
            //handling error
            else {
                console.log( weather )
                //weather will contain an error object (see APIXU DOCUMENTATION)
                Materialize.toast( weather.error.message, 8000, 'error-toast' )
                //Using Materialize toast component to display error messages - see http://materializecss.com/dialogs.html
            }


        }
        catch ( error ) {
            Materialize.toast( error, 8000, 'error-toast' )
            console.log( 'Failed fetching data: ', error )
        }


        var request = require('request-promise');

        var option = {
            headers: {},
            url: 'https://api.jcdecaux.com/vls/v1/stations?contract='+this.state.city+'&apiKey=8d3e2fe2f9cc01975dba09687d01757a9d871556',
            dataType: 'json',
            type: 'GET',
        };

        request.get(option).then(function(body){
            var json = JSON.parse(body);

            console.log(json);
            //boucle pour afficher tous les éléments du tableau
            // [{},{}] array de documents json
        });

    }

    //will fetch a picture with the name of the city fetched by the weather API
    //will return an updated weather object (same object + one image)
    fetchPicture = async ( weather ) => {
        try {

            const pictures = await get( ENDPOINTS.PIXABAY_API_URL, {
                //YOU NEED TO PROVIDE YOUR "PIXABAY" API KEY HERE (see /utils/api.js file to grab the DOCUMENTATION link)
                key: '3658891-beeef4fdb6b8a762ab78e1cf9',
                q: weather.location.name + '+city',
                image_type: 'all',
                safesearch: true
            } )

            //if we have results
            if ( pictures.hits.length ) {
                //saving the first picture of the results in our weather object
                weather.pixabayPicture = pictures.hits[ 0 ].webformatURL
            }
            //else we save a defalut picture in our weather object
            else {
                weather.pixabayPicture = defaultPicture
            }

        }
        //same default picture is saved if the image request fails
        catch ( error ) {

            weather.pixabayPicture = defaultPicture

            Materialize.toast( error, 8000, 'error-toast' )
            console.log( 'Failed fetching picture: ', error )
        }

        
        return weather
    }


    //handle display of the received weather object
    displayWeatherInfo = () => {
        console.log("oui OK");
        console.log(this.state.option);
        const weather = this.state.option
        console.log(weather);

        /*
            DATA FORMAT SENT BY THE API LOKKS LIKE THIS :
    
            {
                "pixabayPicture": string, //CUSTOM ADD VIA PIXABAY API CALL
                "location": {
                    "name": string,
                    "region": string,
                    "country": string,
                    "lat": number,
                    "lon": number,
                    "tz_id": string,
                    "localtime_epoch": number,
                    "localtime": string
                },
                "current": {
                    "temp_c": number,
                    "is_day": boolean,
                    "condition": {
                        "text": string,
                        "icon": string
                    },
                    "wind_kph": number
                }
            }
    
        */

        /*
        {
          "number": 123,
          "contract_name" : "Paris",
          "name": "nom station",
          "address": "adresse indicative",
          "position": {
            "lat": 48.862993,
            "lng": 2.344294
          },
          "banking": true,
          "bonus": false,
          "status": "OPEN",
          "bike_stands": 20,
          "available_bike_stands": 15,
          "available_bikes": 5,
          "last_update": <timestamp>
        }
        */

        if ( weather ) {

            console.log("oui");
            const locationName = weather.stations.name
            console.log("oui");
            const temperature = weather.stations.address
            console.log("oui");
            const weatherConditionText = weather.stations.available_bikes
            console.log("oui");
            const weatherConditionIcon = weather.stations.available_bike_stands
            const windSpeed = weather.stations.banking
            const picture = weather.pixabayPicture

            return (
                <WeatherCard
                    locationName={ locationName }
                    temperature={ temperature }
                    weatherConditionText={ weatherConditionText }
                    weatherConditionIcon={ weatherConditionIcon }
                    windSpeed={ windSpeed }
                    picture={ picture } />
            )
        }

        return null
    }

}

export default App


