import React from 'react'

const Course = ({ course }) => {
  return (
      <div>
          <Header course={course} />
          {course.parts.map(part => 
              <Part key={part.id} part={part} />
          )}
          <TotalExercises course={course} />
      </div>
    )
}

const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
  }
  
  const Part = ({part}) => (
      <p>
        {part.name} {part.exercises}
      </p>    
    )

  const TotalExercises = ({ course }) => {
      const numExercises = course.parts.reduce((total, part) => {
          return total + part.exercises
      }, 0)
      return (
          <div>
              <b>total of {numExercises} exercises</b>
          </div>
      )
  }
  
export default Course