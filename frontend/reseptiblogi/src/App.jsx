import { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import KotiSivu from './pages/KotiSivu'
import YksiSivu from './pages/YksiSivu'
import Ruokablogi from './assets/Ruokablogi.png'

// handleSearchSubmit <form onSubmit={handleSearchSubmit}>
// const SearchForm = ({ search, handleSearchChange }) => {
//   return (
//     <input
//       className='hakupalkki'
//       value={search}
//       onChange={handleSearchChange}
//       placeholder='Hae resepti nimellä...'
//     />
//   )
// }

const LoginForm = ({ handleLogin, username, password, handleUnChange, handlePwChange, setShowForm }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>

        Käyttäjänimi: <input value={username} onChange={handleUnChange} />
      </div>
      <div>
        Salasana: <input type='password' value={password} onChange={handlePwChange} />
      </div>
      <button className='form-napit' type='submit'> Kirjaudu sisään </button>
      <button className='form-napit2' type='button' onClick={() =>
        setShowForm("register")}> Ei ole käyttäjää? Luo käyttäjä </button>
    </form>
  )
}

const SignupForm = ({ handleSignup, newUsername, newEmail, newPassword, handleNuChange, handleNeChange,
  handleNpChange, setShowForm }) => {
  return (
    <form onSubmit={handleSignup}>
      <div>

        Nimi: <input value={newUsername} onChange={handleNuChange} />
      </div>
      <div>
        Sähköposti: <input value={newEmail} onChange={handleNeChange} />
      </div>
      <div>
        Salasana: <input type='password' value={newPassword} onChange={handleNpChange} />
      </div>
      <button className='form-napit' type='submit'> Rekisteröidy </button>
      <button className='form-napit2' type='button' onClick={() =>
        setShowForm("login")}> Onko sinulla tili? Kirjaudu </button>
    </form>
  )
}

const NewRecipeForm = ({ addRecipe, newTitle, newDescription, newIngredients, newInstructions, newImage,
  handleTitleChange, handleDescriptionChange, handleIngredientsChange, handleInstructionChange,
  handleImageChange
}) => {
  return (
    <form onSubmit={addRecipe}>
      <div>
        Otsikko: <input value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
        Kuvaus: <input value={newDescription} onChange={handleDescriptionChange} />
      </div>
      <div>
        Ainekset: <input value={newIngredients} onChange={handleIngredientsChange} />
      </div>
      <div>
        Ohjeet: <input value={newInstructions} onChange={handleIngredientsChange} />
      </div>
      <div>
        Kuva: <input value={newImage} onChange={handleImageChange} />
      </div>
      <button type='submit'> Lisää </button>
    </form>
  )
}

function App() {

  const [recipes, setRecipes] = useState([])

  const [isLogged, setIsLogged] = useState(false)

  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [email, setEmail] = useState('')

  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newIngredients, setNewIngredients] = useState('')
  const [newInstructions, setNewInstructions] = useState('')
  const [newImage, setNewImage] = useState('')

  const [search, setSearch] = useState('')

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

  // useEffect(() => {
  //   axios
  //     .get('http://localhost:3001/comments')
  //     .then(response => {
  //       setComments(response.data)
  //     })
  // }, [])

  const handleLogin = (event) => {
    event.preventDefault()

    axios
      .post('http://localhost:3001/login', {
        username: username.trim(),
        password
      })
      .then(response => {
        setUser(response.data.user)

        setIsLogged(true)

        setUsername('')
        setPassword('')
        setShowForm(null)
        setErrorMessage(null)
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error)

        if (errorMessage === 'Password missing') {
          setErrorMessage('Salasana puuttuu')
        } else if (errorMessage === 'Username missing') {
          setErrorMessage('Käyttäjänimi puuttuu')
        } else if (errorMessage === 'Invalid username or password') {
          setErrorMessage('Väärä käyttäjänimi tai salasana')
        }
      })
  }

  const handleSignup = (event) => {
    event.preventDefault()
    const signupObject = { username: newUsername, email: newEmail, password: newPassword }

    axios
      .post('http://localhost:3001/register', signupObject)
      .then(response => {
        setUser(response.data.user)
        setIsLogged(true)

        setNewUsername('')
        setNewEmail('')
        setNewPassword('')
      })
  }

  const login = () => {
    setUser({ username: username })
    setUsername('')
    setPassword('')
  }

  const logout = () => {
    setUser(null)
    setIsLogged(false)
    setShowForm(null)
  }

  const handleUnChange = (event) => setUsername(event.target.value)
  const handlePwChange = (event) => setPassword(event.target.value)

  const handleNuChange = (event) => setNewUsername(event.target.value)
  const handleNeChange = (event) => setNewEmail(event.target.value)
  const handleNpChange = (event) => setNewPassword(event.target.value)

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleDescriptionChange = (event) => setNewDescription(event.target.value)
  const handleIngredientsChange = (event) => setNewIngredients(event.target.value)
  const handleInstructionChange = (event) => setNewInstructions(event.target.value)
  const handleImageChange = (event) => setNewImage(event.target.value)

  const addRecipe = (event) => {
    event.preventDefault()
    const newRecipeObject = {
      title: newTitle, description: newDescription,
      ingredients: newIngredients, instructions: newInstructions, image_url: newImage
    }


    axios
      .post('http://localhost:3001/recipe', newRecipeObject)
      .then(response => {
        setRecipes(prev => [...prev, response.data])
        setNewTitle('')
        setNewDescription('')
        setNewIngredients('')
        setNewInstructions('')
        setNewImage('')
      })
  }

  return (
    <div className='sivu'>

      <header className='yläpalkki'>
        <div className='logon-sijainti'>
          <div className='logo'>
            <Link to='/'>
              <img src={Ruokablogi} alt='blogi-logo' className='blogi-logo' />
            </Link>
          </div>

        </div>

        {errorMessage &&
          <p> {errorMessage} </p>
        }

        <div className='nappi-sijainti'>
          {!isLogged ? (

            <div className='napit'>
              <button className='ks-nappi' onClick={() => setShowForm("login")}>
                Kirjaudu sisään
              </button>
              <button className='re-nappi' onClick={() => setShowForm("register")}>
                Rekisteröidy
              </button>
            </div>
          ) : (
            <div className='käyttäjä'>
              <h2> Tervetuloa {user?.username} </h2>

              <button onClick={logout}>
                Kirjaudu ulos
              </button>
            </div>
          )}
        </div>
      </header>

      {isLogged && (
        <>
          <h4> Lisää uusi resepti </h4>
          <NewRecipeForm
            addRecipe={addRecipe}
            newTitle={newTitle}
            newDescription={newDescription}
            newIngredients={newIngredients}
            newInstructions={newInstructions}
            newImage={newImage}
            handleTitleChange={handleTitleChange}
            handleDescriptionChange={handleDescriptionChange}
            handleIngredientsChange={handleIngredientsChange}
            handleInstructionChange={handleInstructionChange}
            handleImageChange={handleImageChange}
          />
        </>
      )}

      {!isLogged && showForm && (
        <div className='modal-overlay' onClick={() => setShowForm(null)}>

          <div className='modal' onClick={(event) => event.stopPropagation()}>

            <div className='modal-header'>
              <h2>
                {showForm === "login" ? "Kirjaudu sisään" : "Rekisteröidy"}
              </h2>

              <button className='x-nappi' onClick={() => setShowForm(null)}>
                X
              </button>
            </div>

            {showForm === "login" && (
              <div className='kirjautuminen'>
                <LoginForm
                  setShowForm={setShowForm}
                  handleLogin={handleLogin}
                  username={username}
                  password={password}
                  handleUnChange={handleUnChange}
                  handlePwChange={handlePwChange} />
              </div>
            )}

            {showForm === "register" && (
              <div className='rekisteröityminen'>
                <SignupForm
                  setShowForm={setShowForm}
                  handleSignup={handleSignup}
                  newUsername={newUsername}
                  newEmail={newEmail}
                  newPassword={newPassword}
                  handleNuChange={handleNuChange}
                  handleNeChange={handleNeChange}
                  handleNpChange={handleNpChange} />
              </div>
            )}
          </div>
        </div>
      )}


      <Routes>
        <Route path='/'
          element={<KotiSivu recipes={recipes} />} />

        <Route path='/recipe/:id'
          element={<YksiSivu recipes={recipes} />} />
      </Routes>

    </div>
  )
}

export default App