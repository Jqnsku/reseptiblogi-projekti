import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import nuoli from '../assets/nuoli.svg'

function YksiSivu({ recipes, user, token }) {
  const { id } = useParams()

  const recipe = recipes.find(r => String(r.recipe_id) === id)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])

  const handleAddComment = (event) => {
    event.preventDefault()

    console.log("SUBMIT FIRED")
    console.log("TOKEN:", token)
    console.log("ID:", id)
    console.log("COMMENT:", newComment)

    if (!token) {
      console.log("Ei tokenia → kirjaudu sisään")
      return
    }

    axios
      .post('http://localhost:3001/comments', {
        content: newComment,
        recipe_id: Number(id),
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(response => {
        setComments(prev => [...prev, response.data[0]])
        setNewComment('')
      })
      .catch(error => {
        console.log("POST FAILED")
        console.log(error.response?.status)
        console.log(error.response?.data)
      })
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3001/comments/${id}`)
      .then(response => {
        setComments(response.data)
      })
  }, [])

  const deleteComment = (comment_id) => {

    axios
      .delete(`http://localhost:3001/comments/${comment_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
        .then(() => {
          setComments(prev => prev.filter(comment => comment.comment_id !== comment_id))
        })
        .catch(error => {
          console.log(error.response?.data)
        })
  }

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

        <div className='resepti-sisältö'>
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

          <div className='resepti-kommentti'>
          </div>
          <form onSubmit={handleAddComment} className='Kommentti-form'>
          <h2> Kommentit </h2>


            <textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder='Kirjoita kommentti...'
            />
            <button type='submit'> Lähetä kommentti </button>
          </form>

          <ul className='kommenttilista'>
            {comments
              .filter(comment => String(comment.recipe_id) === id)

              .map(comment => (
                <li className='kommentti' key={comment.comment_id}>

                  <div className='kommentti-header'>
                    <span className='kommentti-käyttäjä'>
                      {comment.user?.username}
                    </span>

                    <span className='kommentti-pv'>
                      {new Date(comment.created_at).toLocaleDateString('fi-FI')}
                    </span>
                  </div>

                  <div className='kommentti-sisältö'>
                    {comment.content}
                  </div>

                  {user?.username === comment.user?.username && (
                    <button className='poista-kommentti'
                      onClick={() => {
                        setCommentToDelete(comment.comment_id)
                        setShowDeleteModal(true)
                       }}>
                      Poista kommentti
                      </button>
                  )}
{/* deleteComment(comment.comment_id, setComments) */}
                </li>
              ))}
          </ul>
          {showDeleteModal && (
            <div className='modal-overlay'>
            <div className='modal'>

              <h3> Poista kommentti </h3>

              <p> Haluatko varmasti poistaa kommentin? </p>

              <button onClick={() => {
                deleteComment(commentToDelete)
                setShowDeleteModal(false)
              }}>
                Poista
              </button>

              <button onClick={() => {
                setShowDeleteModal(false)
                setCommentToDelete(null)
              }}>
              Peruuta
              </button>
              </div>
              </div>
          )}
        </div>
      </div>
    </div>
    // className='kommentti-kontentti'
  )
}

export default YksiSivu