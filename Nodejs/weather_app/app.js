const geocoding = require('./utils/geocoding')
const forecast = require('./utils/forecast')

const address = process.argv[2]
if (address) {
    geocoding(address, (error, { latitude, longtitude, location } = {}) => {
        if (error) {
            return console.log('Error', error);
        }
        forecast(latitude, longtitude, (error, { description, temperatur, feelslike }) => {
            if (error) {
                return console.log('Error', error);
            }
            console.log({
                'location': location,
                'description': description,
                'temperatur': temperatur,
                'feelslike': feelslike
            })
        })
    })
} else {
    console.log('Please provide the address');

}