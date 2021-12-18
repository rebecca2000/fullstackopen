import React, { useState } from 'react'

let prevNum = -1

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  
  const newAnecdote = () => {
    let number = Math.round(Math.random()*(anecdotes.length-1))
    while (number === prevNum) {
      number = Math.round(Math.random()*(anecdotes.length-1))
    }
    prevNum = number
    console.log(number)
    setSelected(number)
  }

  const updateVote = () => {
    const pointsCopy = { ...points }
    pointsCopy[selected] += 1
    setPoints(pointsCopy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} <br />
      <button onClick={updateVote}>vote</button>
      <button onClick={newAnecdote}>next ancedote</button>
      <MostVotes anecdotes={anecdotes} points={points}/>
    </div>
  )
}

const MostVotes = ({anecdotes, points}) => {
  let largest = 0
  for (let i=1; i<anecdotes.length; i++) {
    if (points[i] > points[largest]) {
      largest = i
    }
  }
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[largest]} has {points[largest]} votes
    </div>
  )
}

export default App