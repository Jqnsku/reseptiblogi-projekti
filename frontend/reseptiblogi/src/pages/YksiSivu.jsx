import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

function YksiSivu({ recipes }) {
  const { id } = useParams()

  const recipe = recipes.find(r => String(r.recipe_id) === id)

  const [comments, setComments] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/comments')
      .then(response => {
        setComments(response.data)
        console.log("ID:", id)
      })
  }, [])

  if (!recipe) return <p> Ladataan... </p>

  return (
    <div className='kokoSivu'>
      <div>
        {/* <Link to={`/recipe/${recipe.recipe_id}`}> */}
        <Link to='/'>
          Palaa resepteihin
        </Link>
      </div>

      <div className='yksisivu'>

        <img src={recipe.image_url}></img>

        <div className='sisältö'>
          <h1> {recipe.title} </h1>
          <p> {recipe.description} </p>

          <h2>Ainekset</h2>
          <ul>
            {recipe.ingredients.split(',').map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>

          <h2>Ohjeet</h2>
          <ol>
            {recipe.instructions.split(',').map((step, index) => (
              <li key={index}>{step.trim()}</li>
            ))}
          </ol>
          <h2> Kommentit </h2>
          {comments
            .filter(comment => String(comment.recipe_id) === id)
            .map((comment, index) => (
              <li key={index}>{comment.content}
              </li>
            ))}
        </div>
      </div>
    </div>
  )
}
export default YksiSivu