import React from 'react'

const PersonForm = ({ onSubmit, nameValue, nameOnChange, numberValue, numberOnChange }) => {
  return (
    <form onSubmit={onSubmit}>
        <div>name: <input value={nameValue} onChange={nameOnChange}/></div>
        <div>number: <input value={numberValue} onChange={numberOnChange}/></div>
        <button type="submit">add</button>
    </form>
  )
}

export default PersonForm