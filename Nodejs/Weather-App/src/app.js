const path = require('path')
const express = require('express')

const geocoding = require('./utils/geocoding')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const pathForHTMLPage = path.join(__dirname, '../public')
const pathForview = path.join(__dirname, '../views')


// setup static directory to server 
app.use(express.static(pathForHTMLPage))

//setuup handlebar engine for view
app.set('views', pathForview);
app.set('view engine', 'hbs');


app.get('', (req, res) => {
    res.render('index', {
        title: 'Home',
        name: 'Jeevan'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            Error: 'You must provide address to know the weather!'
        })
    }
    geocoding(req.query.address, (error, { latitude, longtitude, location, locationName } = {}) => {
        if (error) {
            return res.send({
                Error: error
            })
        }
        forecast(latitude, longtitude, (error, { description, temperatur, feelslike, windspeed, humidity, timezone, locationtime }) => {
            if (error) {
                return res.send({
                    Error: error
                })
            }
            return res.send({
                'location': location,
                'description': description,
                'temperatur': temperatur,
                'feelslike': feelslike,
                'windspeed': windspeed,
                'humidity': humidity,
                'locationName': locationName,
                'timezone': timezone,
                'locationtime': locationtime
            })
        })
    })
})

// app.get('*', (req, res) => {
//     res.render('error', {
//         errorText: '404 Error'
//     })
// })


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})