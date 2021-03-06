const express =require('express');
const app =express();
const fetch =require('node-fetch');
const http =require('http');
const bodyParser= require('body-parser');
const fs =require('fs');

app.use(bodyParser.json());

let lon=75.698975,lat=13.946204;
let key=require('./credential.js');
//https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=5cfaa3fc91d59befb10d31a841f0ece5
app.get('/top.ico',(req,res,next) =>
{
    res.sendFile("tpi.ico",{root:__dirname});
})
app.get('/',(req,res,next) =>
{
    res.sendFile("./public/index.html",{root:__dirname});
})

app.get('/script.js',(req,res,next) =>
{
    var script= fs.readFileSync('public/script.js',"utf8");
    res.end(script);
})

app.get('/styles.css',(req,res,next) =>
{
    var script= fs.readFileSync('public/styles.css',"utf8");
    res.end(script);
})

app.post('/future',(req,res,next) =>
{
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${req.body.lat}&lon=${req.body.lon}&exclude=hourly,
           minutely&units=metric&appid=${key}`)
        .then((resp)=>
        {
            if(resp.ok)
                return resp;
        },e=>{throw e})
        .then(resp=>resp.json())
        .then(resp=>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            return res.json(resp);
        })
        .catch(e=> {console.log(e)});
})

app.post('/detail',(req,res,next) =>{
   fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lon}&units=metric&appid=${key}`)
       .then((resp)=>
       {
           if(resp.ok)
               return resp;
           else
           {
               var err =new Error("Error");
               err.statusText=resp.statusText;
               throw (err);
           }
       },err =>{throw err})
        .then((resp)=>resp.json())
        .then((resp) =>
        {
            if(resp.cod===200)
            {
               /* let date =new Date(resp.sys.sunset*1000)
                console.log("Time is "+date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds());*/
                res.statusCode=200;
                res.setHeader('Content-Type',"application/json");
                return res.json(resp);
            }
            else
            {
                res.statusCode=501;
                console.log(resp);
                res.end();
            }
        })
           .catch(err=>{
                res.statusCode=200;
                res.setHeader('Content-Type',"application/json");
                return res.json(err);
           })
})

app.post('/city_detail',(req,res,next) =>
{
    let site="http://api.openweathermap.org/data/2.5/weather?q="+req.body.city+"&units=metric&appid=5cfaa3fc91d59befb10d31a841f0ece5";
    fetch(site)
        .then(resp=>
        {
            if(resp.ok)
                return resp;
            else
            {
                throw new Error(resp.statusText);
            }
        },err=>
        {
            throw err
        })
        .then(resp => resp.json())
        .then((resp) =>
        {
            if(resp.cod===200)
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', "application/json");
                return res.json(resp);
            }
            else
            {
                res.statusCode=501;
                console.log(resp);
                res.end();
            }
        })
        .catch((err) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type',"application/json");
            return res.json(err);
        })
})



var port = (process.env.PORT || '3000');
app.set('port',port);

let server= http.createServer(app);
server.listen(port, () =>
{
    console.log("Listening on port ",port);
})




