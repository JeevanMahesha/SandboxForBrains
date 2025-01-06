const express = require("express")
require("./Database/db")
const userRouter = require("./routers/userRouter")
const imageRouter = require('./routers/imageRouter')
const ringtoneRouter = require("./routers/ringtoneRouter")
const path = require("path")
const cors = require("cors")



const app = express()
const port = process.env.PORT

app.use(cors())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/audios', express.static(path.join(__dirname, 'audios')))
app.use(express.json())
app.use(userRouter)
app.use(imageRouter)
app.use(ringtoneRouter)

const pathForPublic = path.join(__dirname, 'public')
app.use(express.static(pathForPublic))
const pathForHtml = path.join(__dirname, 'views')

app.set('views', pathForHtml);
app.set('view engine', 'hbs');

app.get('', (req, res) => {
    res.render('index')
})
app.get('/audio', (req, res) => {
    res.render('audio')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/profile', (req, res) => {
    res.render('profile')
})
app.get('/myaudio', (req, res) => {
    res.render('myaudio')
})
app.get('/mywallpaper', (req, res) => {
    res.render('mywallpaper')
})
app.listen(port, () => {
    console.log("server in up on " + port);

})