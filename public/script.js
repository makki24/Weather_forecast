
 let lat,lon;
 let weath_icon ="http://openweathermap.org/img/wn/"
    function getLocation()
    {
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((position)=>
            {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                document.getElementById("pos").innerHTML = "Lattitude is " + lat + " longitude is " + lon;
                let obj={lat,lon};
                console.log(obj);
                fetch("http://localhost:3000/detail",
                    {
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify(obj)
                    })
                    .then((resp) =>
                    {
                        if (resp.ok)
                            return resp;
                        else
                        {
                            console.log(resp);
                            var err = new Error("Error");
                            err.statusText = resp.statusText;
                            throw (err);
                        }
                    }, err =>
                    {
                        throw err
                    })
                    .then((resp) => resp.json())
                    .then((resp) =>
                    {
                        if (resp.cod === 200)
                        {
                            console.log(resp);
                            let path=weath_icon+resp.weather[0].icon+"@2x.png";
                            let sunrise=new Date(resp.sys.sunrise*1000);
                            console.log(path);
                            document.getElementById('icon').setAttribute("src",path);
                            document.getElementById('temp').innerHTML =" : "+resp.main.temp+"<sup>o</sup> cel";
                            document.getElementById('rise').innerHTML =" : "+sunrise.getHours()+":"+sunrise.getMinutes()+":" +
                                ""+sunrise.getSeconds();
                        }
                        else
                        {
                            throw new Error("Something went wrong");
                        }
                    })
                    .catch(err =>
                    {
                        console.log(err);
                    })
            })
        }
    }

    function request()
    {
        document.getElementById("pos").innerHTML="Got it";
    }