const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocoding = require('./utils/geocoding')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for express config
const pathForHTMLPage = path.join(__dirname, '../public')
const pathForview = path.join(__dirname, '../templets/views')
const pathForpartials = path.join(__dirname, '../templets/partials')

// setup static directory to server 
app.use(express.static(pathForHTMLPage))

//setuup handlebar engine for view
app.set('views', pathForview);
app.set('view engine', 'hbs');
hbs.registerPartials(pathForpartials)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Home',
        name: 'Jeevan'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Jeevan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'help',
        name: 'Jeevan'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            Error: 'You must provide address to know the weather!'
        })
    }
    geocoding(req.query.address, (error, { latitude, longtitude, location } = {}) => {
        if (error) {
            return res.send({
                Error: error
            })
        }
        forecast(latitude, longtitude, (error, { description, temperatur, feelslike }) => {
            if (error) {
                return res.send({
                    Error: error
                })
            }
            return res.send({
                'location': location,
                'description': description,
                'temperatur': temperatur,
                'feelslike': feelslike
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        errorText: 'help 404 Error'
    })
})


app.get('*', (req, res) => {
    res.render('error', {
        errorText: '404 Error'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000');
})