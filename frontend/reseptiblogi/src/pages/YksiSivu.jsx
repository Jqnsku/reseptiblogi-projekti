import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import nuoli from '../assets/nuoli.svg'

function YksiSivu({ recipes }) {
  const { id } = useParams()

  const recipe = recipes.find(r => String(r.recipe_id) === id)

  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])

  const handleAddComment = (event) => {
    event.preventDefault()

    axios
    .post('http://localhost:3001/comments', {
      content: newComment,
      recipe_id: id,
      username: user.username
    })
    .then(response => {
      setComments([...comments, response.data])
      setNewComment('')
    })
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3001/comments/${id}`)
      .then(response => {
        setComments(response.data)
      })
  }, [])

  if (!recipe) return <p> Ladataan... </p>

  return (
    <div className='kokoSivu'>
      <div className='takaisin-nappi'>
        <Link to='/'>
        <img src={nuoli} alt='takaisin' className='nuoli-icon' />
          Takaisin resepteihin
        </Link>
      </div>

      <div className='yksisivu'>

        <img src={recipe.image_url}></img>

        <div className='sisältö'>
          <h1> {recipe.title} </h1>
          <p> {recipe.description} </p>

          <div className='reseptiInfo'>

            <div className='info'>
              <div className='tieto'> Valmisteluaika </div>
              <div className='määrä'> {recipe.prep_time} minuuttia </div>
            </div>

            <div className='info'>
            <div className='tieto'> Kypsennysaika </div>
              <div className='määrä'> {recipe.cook_time} minuuttia </div>
            </div>

            <div className='info'>
              <div className='tieto'> Annosta </div>
              <div className='määrä'> {recipe.servings} </div>
            </div>
          </div>

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
              <li key={index}>
               <p> {comment.username} </p>: {comment.content}
              </li>
            ))}
        </div>

          <form onSubmit={handleAddComment} className='Kommentti-form'>
            <textarea 
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder='Kirjoita kommentti...'
            />
            <button type='submit'> Lähetä </button>
          </form>

      </div>
    </div>
  )
}
export default YksiSivu