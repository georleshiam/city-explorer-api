const express = require("express")
const cors = require('cors')
const app = express()
const weatherdata = require("./data/weather.json")
const { fork } = require("child_process")


app.use(cors())

class ForeCast{
    constructor(date, description){
        this.date = date
        this.description = description
    }
}



app.get('/', function(request, response){
    response.send("hello")

})
app.get("/weather", function(request, response){
    console.log(request.query.lat)
    console.log(request.query.lon)
    console.log(request.query.searchQuery)
    let cityData = weatherdata.find(function(element){
        if(element.city_name === request.query.searchQuery){
            return true
        }else{
            return false
        }
    })
    if(cityData=== undefined){
        response.status(500).send({message:"Error 500"});
        return
    }

    console.log(cityData)
    let forecastData = cityData.data.map(function(element){
        return new ForeCast(element.datetime, element.weather.description)

    })
    response.send(forecastData)

})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is Broken!')
})

app.listen(3001)