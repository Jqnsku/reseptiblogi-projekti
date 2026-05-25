import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

function YksiSivu({ recipes }) {
  const { id } = useParams()

  const recipe = recipes.find(r => String(r.recipe_id) === id)

  const [comments, setComments] = useState([])

  if (!recipe) return <p> Ladataan... </p>

  useEffect(() => {
    axios
      .get('http://localhost:3001/comments')
      .then(response => {
        setComments(response.data)
      })
  }, [])

  return (
    <div className='kokoSivu'>
      <div className='yksisivu'>
        <div>
          <Link to='/'>
            Palaa resepteihin
          </Link>
        </div>


        <img src={recipe.image_url}></img>
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
        <h2> Comments </h2>
      </div>
    </div>
  )
}
export default YksiSivu