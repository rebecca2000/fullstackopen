import React, { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import personService from './services/services'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [displayPeople, setDisplayPeople] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [msgStyle, setMsgStyle] = useState('')

  useEffect(() => {
    console.log('loading persons')
    personService.getAll()
      .then(initPersons => {
        setDisplayPeople(initPersons)
        setPersons(initPersons)
      }
    )
    .catch(error => {
      console.log('failed to load persons: ', error)
    })
  }, [])

  function updateStatesAddPerson(newPerson) {
    let newPersons = []
    if (persons.find(p => p.id === newPerson.id)) {
      newPersons = persons.map(p => p.id === newPerson.id ? newPerson : p)
      updateMessage(`Updated number for ${newPerson.name}`, 'notification')
    } else {
      newPersons = persons.concat(newPerson)
      updateMessage(`Added ${newPerson.name}`, 'notification')
    }
    setPersons(newPersons)
    setDisplayPeople(searchHelper(newPersons, searchTerm))
    setNewName('')
    setNewNumber('')
  }

  const updateMessage = (msg, style) => {
    setMessage(msg)
    setMsgStyle(style)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => personEquals(person, newPerson))) {
      const replace = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      console.log(replace)
      if (replace) {
        const id = getIdFromName(persons, newPerson.name)
        personService
          .update(id, newPerson)
          .then(function(response) {
            updateStatesAddPerson(response)
          })
          .catch(error => {
            console.log('update persons: ', error)
            updateMessage(`Information of ${newPerson.name} has already been removed from the server`, 'error')
          })
      } else {
        return
      }
    } else {
      personService
      .create(newPerson)
      .then(response => updateStatesAddPerson(response))
      .catch(error => {
        console.log('failed to add person: ', error)
      })
    }
  }

  // const handleError = (logError, userError) => {
  //   console.log(logError)
  //   updateMessage(userError, 'error')
  // }

  const handleInputName = (event) => {
    setNewName(event.target.value)
  }

  const handleInputNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    console.log(event.target.value)
    console.log('handleSearch persons: ', persons)
    setDisplayPeople(searchHelper(persons, event.target.value))
    setSearchTerm(event.target.value)
  }

  const handleDelete = (name) => {
    if (window.confirm(`Delete ${name}?`)) {
      const deleteID = getIdFromName(persons, name)
      console.log('deleteID, ', deleteID)
      personService
        .remove(deleteID)
        .then(function(response) {
            console.log(response)
            const newPersons = persons.filter(person => person.id !== deleteID)
            setPersons(newPersons)
            setDisplayPeople(searchHelper(newPersons, searchTerm))
            updateMessage(`Deleted ${name}`, 'notification')
          }
        )
        .catch(error => {
          console.log('failed to delete person: ', error)
        })
    } else {
      return
    }
  }

  return (
    <div>
      <Notification message={message} style={msgStyle}/>
      <h2>Phonebook</h2>
      <Filter value={searchTerm} onChange={handleSearch}/>
      <h2>Add new record</h2>   
        <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleInputName}
                                         numberValue={newNumber} numberOnChange={handleInputNumber}/>  
      <h2>Numbers</h2>
      <Persons array={displayPeople} handleDelete={handleDelete}/>
    </div>
  )
}

function searchHelper(array, searchTerm) {
  return array.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
}

function personEquals(p1, p2) {
  if (p1.name === p2.name) {
    return true
  }
  return false
}

function getIdFromName(allPeople, name) {
  const person = allPeople.find(person => person.name === name)
  console.log('getIdFromName, found: ', person)
  return person.id
}

export default App