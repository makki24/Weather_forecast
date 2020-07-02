const express =require('express');
const router =express.Router();
const fetch =require('node-fetch');

const bodyParser= require('body-parser');

router.use(bodyParser.json());


fetch("http://api.openweathermap.org/data/2.5/weather?lat=13.946204&lon=75.698975&units=metric&appid=5cfaa3fc91d59befb10d31a841f0ece5")
    .then((resp)=>resp.json())
    .then((resp) =>
    {
        console.log(resp);
    })


