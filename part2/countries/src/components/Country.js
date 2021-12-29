import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Country = ({country}) => {
    const [weather, setWeather] = useState()

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
            .then(response => {
                setWeather(response.data)
                }
            ).catch(error => 
                console.log('fetch weather data failed: ', error)
            )
    }, [country])

    const countryInfo = <div>
               <h1>{country.name.common}</h1> 
                capital: {country.capital}<br/>
                population: {country.population}
                <h2>Languages</h2>
                {Object.entries(country.languages).map(language =>
                <li key={language}>{language[1]}</li>
                )} <br/>
                <img key={country.flags.png} src={country.flags.png} alt='country flag'/>
            </div>

    if (weather) {
        return <div>
                {countryInfo}
                 <h2>Weather in {country.capital}</h2>
                <b>summary:</b> {weather.weather[0].main}<br/>
                <b>temperature:</b> {weather.main.temp} Celcius<br/>
                <b>wind: </b>{weather.wind.speed} metres/sec
                <img key={weather.weather[0].icon} src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt=''/>
            </div>
    } 
    return <div>
        {countryInfo}
        No weather data available for {country.capital}
        </div>
}

export default Country