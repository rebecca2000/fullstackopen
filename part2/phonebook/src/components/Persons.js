import React from 'react'

const Persons = ({ array, handleDelete }) => {
  return (
    <div>
      {array.map(person => 
        <Person key={person.name} person={person} handleDelete={handleDelete}/>
      )}
    </div>
  )
}

const Person = ({person, handleDelete}) => (
  <div>
    <li>
      {person.name} {person.number} 
      <button type='submit' onClick={() => handleDelete(person.name)}>delete</button>
    </li>
  </div>
)

export default Persons