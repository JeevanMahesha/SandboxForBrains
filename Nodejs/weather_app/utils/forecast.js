const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=99efb4d483556a155762ae11abd97747&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '&units=f'
    request({ url, 'json': true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect the Weather Server!', undefined);
        } else if (body.error) {
            callback('Unable to find weather for this location', undefined);
        } else {
            callback(undefined, {
                'description': body.current.weather_descriptions,
                'temperatur': body.current.temperature,
                'feelslike': body.current.feelslike
            })
        }
    })
}

module.exports = forecast