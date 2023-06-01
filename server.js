const express = require("express")
const cors = require('cors')
const app = express()
const weatherdata = require("./data/weather.json")
const { fork } = require("child_process")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config()



app.use(cors())

class ForeCast {
    constructor(date, description) {
        this.date = date
        this.description = description
    }
}

class Movie {

    constructor(adult, backdrop_path, genre_ids, id, original_language, original_title, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count) {
        this.adult = adult
        this.backdrop_path = backdrop_path
        this.genre_ids = genre_ids
        this.id = id
        this.original_language = original_language
        this.original_title = original_title
        this.overview = overview
        this.popularity = popularity
        this.release_date = release_date
        this.title = title
        this.video = video
        this.vote_average = vote_average
        this.vote_count = vote_count
    }

}


app.get('/', function (request, response) {
    response.send("hello")

})
let weathercache = {}


app.get("/weather", async function (request, response) {
    let cityData = weathercache[request.query.searchQuery]
    // console.log(request.query.lat)
    if (cityData === undefined)
    {
        
        console.log("CACHE MISS")
        cityData = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=77c4324de293441698c215757086494d&city=${request.query.searchQuery}`)
        weathercache[request.query.searchQuery]= cityData 
    }else{
        console.log("CACHE HIT")
    }
    


    let forecastData = cityData.data.data.map(function (element) {
        return new ForeCast(element.datetime, element.weather.description)

    })
    response.send(forecastData)

})
let headers = {
    accept: 'application/json',
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjllMDBjZjU5YTc5NmY4NTdlMDA0OTAwMjNmOWZmNyIsInN1YiI6IjY0NGZkNDRmMTI0YzhkMDJlNzdlY2IyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3IHoODKbUEVAdXrPp7An5vCjfKBxdoGw6lnHLR5QP6Q"

}
let moviecache ={}



app.get("/movies", async function (request, response) {
    let movie = request.query.movie
    let movieResponse = moviecache [request.query.movie]
    if (movieResponse === undefined)
     {
        console.log("CACHE MISS")
        movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=ff9e00cf59a796f857e00490023f9ff7&query=${movie}`, headers = headers)
        moviecache[request.query.movie] = movieResponse
    }else{
        console.log("CACHE HIT")
    }
    // send a requst moviedb api
    // URL: https://api.themoviedb.org/3/movie/550?api_key=ff9e00cf59a796f857e00490023f9ff7
    
    response.send(movieResponse.data.results)

})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is Broken!')
})

app.listen(3001, () => { console.log("listening") })