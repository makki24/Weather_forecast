
 let lat,lon;
 let weath_icon ="http://openweathermap.org/img/wn/";
 let flag_icon= "http://openweathermap.org/images/flags/"
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
                            let flg_path=flag_icon+resp.sys.country.toLowerCase()+".png";
                            let sunrise=new Date(resp.sys.sunrise*1000);
                            let sunset =new Date(resp.sys.sunset*1000);
                            document.getElementById('icon').setAttribute("src",path);
                            document.getElementById('desc').innerHTML =
                                resp.weather[0].description.charAt(0).toUpperCase() + resp.weather[0].description.slice(1);
                            document.getElementById('temp').innerHTML =" : "+resp.main.temp+"<sup>o</sup> cel";
                            document.getElementById('rise').innerHTML =" : "+sunrise.getHours()+":"+sunrise.getMinutes()+":" +
                                ""+sunrise.getSeconds();
                            document.getElementById('set').innerHTML =" : "+sunset.getHours()%12+":"+sunset.getMinutes()+":" +
                                ""+sunset.getSeconds();
                            document.getElementById('city').innerHTML=" : "+resp.name;
                            document.getElementById('country').innerHTML=" : "+resp.sys.country;
                            document.getElementById('flg').setAttribute("src",flg_path);
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