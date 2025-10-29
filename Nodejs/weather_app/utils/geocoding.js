const request = require('postman-request')

const geocoding = (location_address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(location_address) + '.json?access_token=pk.eyJ1Ijoia2Fzb2hvZzIyNyIsImEiOiJja2FubmxsNmgxZnY5MnR0ZDFlNzdvaGxxIn0.jieheCuhmxXXSEC17jKRHQ&limit=1'
    request({ url, 'json': true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect gecoding Weather server!', undefined);
        } else if (body.features.length === 0) {
            callback('Unable to find Loction, Try another search', undefined);
        } else {
            callback(undefined, {
                'latitude': body.features[0].center[1],
                'longtitude': body.features[0].center[0],
                'location': body.features[0].place_name
            })
        }
    })
}

module.exports = geocoding