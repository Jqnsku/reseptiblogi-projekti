import { useState, useEffect } from 'react'
import axios from 'axios'

// handleSearchSubmit <form onSubmit={handleSearchSubmit}>
const SearchForm = ({ search, handleSearchChange }) => {
  return (
    <input
      className='hakupalkki'
      value={search}
      onChange={handleSearchChange}
      placeholder='Hae resepti nimellä...'
    />
  )
}

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
    </form>
  )
}

function App() {
  const [recipes, setRecipes] = useState([])

  const [isLogged, setIsLogged] = useState(false)

  const [comments, setComments] = useState([])

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

  useEffect(() => {
    axios
      .get('http://localhost:3001/comments')
      .then(response => {
        setComments(response.data)
      })
  }, [])

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

  const handleSearchChange = (event) => setSearch(event.target.value)

  const filtered = recipes.filter(recipe =>
    recipe.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='sivu'>

      <header className='yläpalkki'>
        <div className='logon-sijainti'>
          <div className='logo'>
            Reseptiblogi
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

          <div className='tietoa'>
            <h2> Viimeisimmät reseptit </h2>
            <p> Löydä herkullisia reseptejä, joita yhteisömme on jakanut </p>

            <SearchForm
              search={search}
              handleSearchChange={handleSearchChange}
            />
          </div>

          <div className='reseptit'>
            {filtered.map(recipe => (
              <div className='resepti' key={recipe.recipe_id}>
                {/* {recipe.title}  */}
                <div className='kaikkiReseptit'>

                  <img className="kuvat"
                    src={recipe.image_url}
                    alt={recipe.title} />

                  <div className='otsikkoKuvaus'>
                    <p> {recipe.title}</p>
                    <p> {recipe.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className='reseptit'>
        {recipes.map(recipe => (
          <div className='resepti' key={recipe.recipe_id}>

            <div className='kaikkiReseptit'>

              <img className="kuvat"
                src={recipe.image_url}
                alt={recipe.title} />

              <div className='otsikkoKuvaus'>
                <p> {recipe.title}</p>
                <p> {recipe.description}</p>
              </div>

            </div>
          </div>
        ))}
      </div> */}

        </div>
      )
      }

      export default App