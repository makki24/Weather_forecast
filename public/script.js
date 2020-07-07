
 let lat,lon;
 let weath_icon ="http://openweathermap.org/img/wn/";
 let flag_icon= "http://openweathermap.org/images/flags/"

function fetchRequest(obj)
{
    if(isNaN(obj.lat) || isNaN(obj.lon) || obj.lat<-90 || obj.lon>180 || obj.lon<-180 || obj.lat>90)
    {
        alert("Invalid latitude and longitude");
        return;
    }

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
                console.log(err);
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
                else
                {
                    throw new Error("Something went wrong");
                }
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
            document.getElementById("pos").innerHTML = "Lattitude is " + lat + " longitude is " + lon;
            let obj={lat,lon};
            console.log(obj);
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
