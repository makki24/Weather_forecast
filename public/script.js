
 let lat,lon;
 let weath_icon ="http://openweathermap.org/img/wn/";
 let flag_icon= "http://openweathermap.org/images/flags/"

function display(resp)
 {
    let path=weath_icon+resp.weather[0].icon+"@2x.png";
    let sunrise=new Date(resp.sys.sunrise*1000);
    let sunset =new Date(resp.sys.sunset*1000);
    document.getElementById('icon').setAttribute("src",path);
    document.getElementById('desc').innerHTML =
        resp.weather[0].description.charAt(0).toUpperCase() + resp.weather[0].description.slice(1);
    document.getElementById('temp').innerHTML =" : "+resp.main.temp+"<sup>o</sup> cel";
    document.getElementById('rise').innerHTML =" : "+sunrise.getHours()+":"+sunrise.getMinutes()+":" +
        ""+sunrise.getSeconds();
    let ex="";
    if(sunset.getHours()>12)
        ex=' pm';
    document.getElementById('set').innerHTML =" : "+sunset.getHours()%12+":"+sunset.getMinutes()+":" +
        ""+sunset.getSeconds()+ex;
    if(resp.sys.country)
    {
        let flg_path=flag_icon+resp.sys.country.toLowerCase()+".png";
        document.getElementById('city').innerHTML=" : "+resp.name;
        document.getElementById('country').innerHTML = " : " + resp.sys.country;
        document.getElementById('flg').setAttribute("src", flg_path);
    }
    else
    {
        let flg_path=""
        document.getElementById('city').innerHTML="";
        document.getElementById('country').innerHTML = "";
        document.getElementById('flg').setAttribute("src", flg_path);
    }
 }

function futureDisplay(resp)
{
    let i=0;
    let obj=document.getElementById('card');
    obj=obj.querySelectorAll('.oneday');
    obj.forEach(tile=>
    {
        tile.querySelector('img').setAttribute('src',weath_icon+resp.daily[i].weather[0].icon+"@2x.png")
        tile.querySelector('.description').textContent=
            resp.daily[i].weather[0].description.charAt(0).toUpperCase()+resp.daily[i].weather[0].description.slice(1);
        tile.querySelector('.temp .value').innerHTML=
            "Temp <div>"+resp.daily[i].temp.min+" - "+resp.daily[i].temp.max+"<sup>o</sup>C</div>";
        tile.querySelector('.temp .morn').textContent="Morn:"+resp.daily[i].temp.morn;
        tile.querySelector('.temp .day').textContent="Day:"+resp.daily[i].temp.day;
        tile.querySelector('.temp .evn').textContent="Evening:"+resp.daily[i].temp.eve;
        tile.querySelector('.temp .night').textContent="Night:"+resp.daily[i].temp.night;
        let sunrise=new Date(resp.daily[i].sunrise*1000);
        let sunset =new Date(resp.daily[i].sunset*1000);
        tile.querySelector('.sunrise').textContent="Sunrise: "+sunrise.getHours()+":"+sunrise.getMinutes()+":" +
        ""+sunrise.getSeconds();
        tile.querySelector('.sunset').textContent="Sunset: "+sunset.getHours()%12+":"+sunset.getMinutes()+":" +
        ""+sunset.getSeconds();
        tile.querySelector('.wind').innerHTML="Wind: "+resp.daily[i].wind_speed+"mps "+resp.daily[i].wind_deg+
        "<sup>o</sup>";
        tile.querySelector('.humidity').textContent="Humidity "+resp.daily[i].humidity+" %"
        i++;
    })
}

function fetchRequest(obj)
{
    if(isNaN(obj.lat) || isNaN(obj.lon) || obj.lat<-90 || obj.lon>180 || obj.lon<-180 || obj.lat>90)
    {
        alert("Invalid latitude and longitude");
        return;
    }

    fetch(`/detail`,
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
                console.log(err);
                throw err
            })
            .then((resp) => resp.json())
            .then((resp) =>
            {
                if (resp.cod === 200)
                {
                    display(resp);
                }
                else
                {
                    throw new Error("Something went wrong");
                }
            })
            .catch(err =>
            {
                console.log(err);
            });
    fetchFuture(obj);
}

function fetchFuture(obj)
{
    fetch('/future',
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
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
                console.log(err);
                throw err
            })
            .then((resp) => resp.json())
            .then((resp) =>
            {
                console.log(resp);
                futureDisplay(resp);
            })
            .catch(err =>
            {
                console.log(err);
            })
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition((position)=>
        {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById("pos").innerHTML = "Your Lattitude is " + lat + " and  longitude is " + lon;
            let obj={lat,lon};
            fetchRequest(obj);
        })
    }
}

function getData()
{
    let formEl = document.forms.form;
    let formData = new FormData(formEl);
    let lat = formData.get('lat');
    let lon = formData.get('lon');
    lat=parseFloat(lat);
    lon=parseFloat(lon);
    fetchRequest({lat,lon});
}

function getDataforCity()
{
    let formEl = document.forms.place;
    let formData = new FormData(formEl);
    let name=formData.get('city_');
    fetch("/city_detail",
        {
            method:'POST',
            headers:{
                    'Content-Type':'application/json'
                },
            body:JSON.stringify({city:name})
        })
        .then(resp =>
        {
            if(resp.ok) return resp;
            else
            {
                throw new Error(resp.statusText);
            }
        },err=> {new err})
        .then( resp => resp.json())
        .then (resp =>
        {
            display(resp);
            fetchFuture(resp.coord);
        })
        .catch(err=>
        {
            console.log(err);
        })
}

function startUp()
{
    let obj=document.getElementById('card');
    let days=['sun','mon','tue','wed','thu','fri','sat','sun'];
    obj=obj.querySelectorAll('.oneday');
    let i=new Date().getDay();
    obj.forEach((tile,index) =>
    {
        tile.querySelector('.date').textContent=days[i].toUpperCase();
        i=(i+1)%7;
        tile.querySelector('.date').setAttribute("style","" +
            "font-size:20px")
    })
}