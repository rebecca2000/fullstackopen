import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Result from './components/Result'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('got all Countries')
        setAllCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value) 
    console.log('handle search ', event.target.value)
  }

  return (
    <div>
      name: <input value={searchTerm} onChange={handleSearch}/><br/>
      <Result allCountries={allCountries} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
    </div>

  )
}

export default App;
