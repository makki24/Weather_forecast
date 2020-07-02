const express =require('express');
const app =express();
const fetch =require('node-fetch');
const http =require('http');
const bodyParser= require('body-parser');

app.use(bodyParser.json());

let lon=75.698975,lat=13.946204;
let key="5cfaa3fc91d59befb10d31a841f0ece5";


app.get('/',(req,res,next) =>{
   fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lon}&units=metric&appid=${key}`)
       .then((resp)=>
       {
           if(resp.ok)
               return resp;
           else
           {
               console.log(resp);
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
                let date =new Date(resp.sys.sunset*1000)
                console.log("Time is "+date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds());
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

var port = (process.env.PORT || '3000');
app.set('port',port);

let server= http.createServer(app);
server.listen(port, () =>
{
    console.log("Listening on port ",port);
})




