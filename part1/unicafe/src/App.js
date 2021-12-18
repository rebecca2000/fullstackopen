import React, { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedback = (type) => () => {
      if (type === fb.GOOD) {
        setGood(good+1)
      } else if (type === fb.BAD) {
        setBad(bad+1)
      } else if (type === fb.NEUTRAL) {
        setNeutral(neutral+1)
      } else {
        console.error("Unsupported feedback type")
      }
  }
  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={feedback(fb.GOOD)} name='good' />
      <Button onClick={feedback(fb.NEUTRAL)} name='neutral' />
      <Button onClick={feedback(fb.BAD)} name='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />      
    </div>
  )
}

const fb = {
  GOOD: 'GOOD', 
  NEUTRAL: 'NEUTRAL', 
  BAD: 'BAD'
}

const Button = ({onClick, name}) => (
    <button onClick={onClick}>{name}</button>
)

const Statistics = ({good, neutral, bad}) => {
  let all = good + neutral + bad
  if (all == 0) {
    return (
      <div>
        <h1>statistics</h1>
        No feedback given
      </div>
    )
  } else {
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value ={all} />
          <StatisticLine text="average" value ={(good-bad)/all} />
          <StatisticLine text="positive" value ={(good/all)*100} text2="%"/>
        </table>
      </div>
      
    )
  }
}

const StatisticLine = ({text, value, text2}) => (
  <tbody>
    <tr>
      <td>{text} </td>
      <td>{value} {text2}</td>
    </tr>
  </tbody>
)

export default App