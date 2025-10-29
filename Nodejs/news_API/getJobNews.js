const request = require('postman-request')
const fs = require('fs')
const { get } = require('http')
const { json } = require('express')
const news = { NEWS: '' }
const GetNews = () => {
    // fs.truncateSync("jobs_news.json")
    url = "http://newsapi.org/v2/everything?q=Jobs&sortBy=publishedAt&apiKey=5f84106dae3d475092fb76d3b5f148e5"
    request({ url, 'json': true }, (error, { body }) => {
        if (error) {
            console.log(error);
        } else if (body.error) {
            console.log(body.error);
        } else {
            // fs.writeFileSync('jobs_news.json', JSON.stringify({ NEWS: body.articles }))
            news.NEWS = body.articles
        }
    })
}
GetNews()