import React from 'react'
import Country from './Country'

const Result = ({allCountries, searchTerm, setSearchTerm}) => {
    const countries = filterCountries(allCountries, searchTerm)
    if (countries.length > 10) {
      console.log('length of countries is >10')
      return <div>Too many matches, specify another filter</div>
    } else if (countries.length <= 10 && countries.length > 1) {
      console.log('countries.length <= 10 && countries.length > 1')
      return <ul>
        {countries.map(country =>
          <li key={country.name.common}>{country.name.common}  
          <button onClick={() => setSearchTerm(country.name.common)}>show</button></li>
        )}
      </ul>
    } else if (countries.length === 1) {
        return <Country country={countries[0]}/>
    } else {
        console.log('No country matches filter')
        return <div>No country matches filter</div>
    }
} 

function filterCountries(allCountries, searchTerm) {
    return allCountries.filter(c => c.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
}

export default Result