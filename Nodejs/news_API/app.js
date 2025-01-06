const request = require('postman-request')
const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const news = { NEWS: '' }

const GetNewsFromAPI = () => {
    url = "http://newsapi.org/v2/everything?q=Jobs&pageSize=100&sortBy=publishedAt&apiKey=5f84106dae3d475092fb76d3b5f148e5"
    request({ url, 'json': true }, (error, { body }) => {
        if (error) {
            console.log(error);
        } else if (body.error) {
            console.log(body.error);
        } else {
            news.NEWS = body.articles
        }
    })
}

setInterval(() => {
    GetNewsFromAPI()
}, 3600000);

app.get('/', (req, res) => {
    return res.send(news)
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})