const WEATHER = (function () {

    const darkSkyKey = '4ca4fc517487f986db37af61d0028349', 
        geocoderKey = 'bb66c85ffa6343a7b7b7b1a84df00029';


    const _getGeocodeURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

    const _getDarkSkyURL = (lat, lng) => `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;


    const _getDarkSkyData = (url, location) => {
        axios.get(url)
            .then((res) => {
                UI.showWeatherData(res.data, location)
            })
            .catch((err) => {
                console.error(err);
            })
    };

    const getWeather = (location) => {

        let geocodeURL = _getGeocodeURL(location);
        axios.get(geocodeURL)
            .then((res) => {
                if (res.data.results.length == 0) {
                    console.error("Invalid Location");
                    return;
                }

                let lat = res.data.results[0].geometry.lat,
                    lng = res.data.results[0].geometry.lng;

                let darkskyURL = _getDarkSkyURL(lat, lng);

                _getDarkSkyData(darkskyURL, location);
            })
            .catch((err) => {
                console.log(err)
            })
    };
    return {
        getWeather
    }
})();


const UI = (function () {

    const showWeatherData = (data, location) => {

            let currentlyData = data.currently,  
                dailyData = data.daily.data,     
                weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                angle = Math.round(currentlyData.windBearing),
                

                
                dailyWeatherBox = document.querySelector("#daily-weather"),
                dailyWeatherModel,
                day,
                maxMinTemp,
                dailyIcon;

            const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
 
    
            document.querySelector(".location-label").innerHTML = location;
            document.querySelector('body').style.backgroundImage = `url("bg-weather/${currentlyData.icon}.jpg")`;
       
            document.querySelector("#currentlyIcon").setAttribute('src', `weather-icons/${currentlyData.icon}.png`);
            document.querySelector("#text-summary-label").innerHTML = currentlyData.summary;
            document.querySelector("#degrees-label").innerHTML = Math.round((
                currentlyData.temperature - 32) * 5 / 9) + '&#176;'
    

            document.querySelector("#humidity").innerHTML = Math.round(currentlyData.humidity * 100) + '%';
            document.querySelector("#wind-speed").innerHTML = (currentlyData.windSpeed * 1.6093).toFixed(1) + ' kph';
            document.querySelector("#pressure").innerHTML =  Math.round(currentlyData.pressure) + 'hPa';
            document.querySelector('#wind-bearing').innerHTML =  directions[Math.round(angle / 45) % 8];

            while (dailyWeatherBox.children[1]) {
                dailyWeatherBox.removeChild(dailyWeatherBox.children[1])
            };

            for (let i = 1; i <= 7; i++) {
            
                dailyWeatherModel = dailyWeatherBox.children[0].cloneNode(true);
                dailyWeatherModel.classList.remove('display-none');
  
                day = weekDays[new Date(dailyData[i].time * 1000).getDay()]
                dailyWeatherModel.children[0].children[0].innerHTML = day;

                maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) + '&#176;' + '/' + Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
                dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

                dailyIcon = dailyData[i].icon;
                dailyWeatherModel.children[1].children[1].children[0].setAttribute('src',`./weather-icons/${dailyIcon}.png`);
             
                dailyWeatherBox.appendChild(dailyWeatherModel);
            }
        };
        return {
            showWeatherData
        }
})();


const GETLOCATION = (function () {

    let location;

    const locationInput = document.querySelector("#location-input"),
        showCityBtn = document.querySelector("#search-btn");


    const _showCity = () => {
        location = locationInput.value;
        locationInput.value = "";
        showCityBtn.setAttribute('disabled', 'true');
        showCityBtn.classList.add('disabled');

        WEATHER.getWeather(location, true)
    }

    locationInput.addEventListener('input', function () {
        let inputText = this.value.trim();

        if (inputText != '') {
            showCityBtn.removeAttribute('disabled');
            showCityBtn.classList.remove('disabled');
        } else {
            showCityBtn.setAttribute('disabled', 'true');
            showCityBtn.classList.add('disabled');
        }
    })

    locationInput.addEventListener('keyup', function () {
        if (event.key === "Enter") {
            _showCity();
        }
    })

    showCityBtn.addEventListener('click', _showCity);
})();





