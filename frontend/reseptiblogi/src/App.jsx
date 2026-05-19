import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [recipes, setRecipes] = useState([])
  const [user, setUser] = useState([])
  const [comments, setComments] = useState([])
  const [newImage, setNewImage] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/recipes')
      .then(response => {
        setRecipes(response.data)
      })
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:3001/user')
      .then(response => {
        setUser(response.data)
      })
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:3001/comments')
      .then(response => {
        setComments(response.data)
      })
  }, [])



  return (
    <>
      <p> Moi </p>
    </>
  )
}

export default App