import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

function KotiSivu({ recipes = [] }) {

    const [showRecipeForm, setShowRecipeForm] = useState(false)
    const [search, setSearch] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newIngredients, setNewIngredients] = useState('')
    const [newInstructions, setNewInstructions] = useState('')
    const [newImage, setNewImage] = useState('')
    const navigate = useNavigate()

    const handleTitleChange = (event) => setNewTitle(event.target.value)
    const handleDescriptionChange = (event) => setNewDescription(event.target.value)
    const handleIngredientsChange = (event) => setNewIngredients(event.target.value)
    const handleInstructionChange = (event) => setNewInstructions(event.target.value)
    const handleImageChange = (event) => setNewImage(event.target.value)

    const filtered = recipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(search.toLowerCase())
    )

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
        <div>
            <div className='tietoa'>
                <h2> Viimeisimmät reseptit </h2>
                <p> Löydä herkullisia reseptejä, joita yhteisömme on jakanut </p>
            </div>

            <div className='haku-lisäys'>
                <input
                    className='hakupalkki'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Hae resepti nimellä...'
                />

                <div className='uusi-resepti'>
                    <p> Lisää uusi resepti </p>

                    <button className='resepti-nappi'
                        onClick={() => setShowRecipeForm(!showRecipeForm)}>
                        +
                    </button>
                </div>
            </div>

            {showRecipeForm && (
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

            <div className='reseptit'>
                {filtered.map(recipe => (
                    <div
                        className='resepti'
                        key={recipe.recipe_id}
                        onClick={() => navigate(`/recipe/${recipe.recipe_id}`)}
                    >
                        <div className='kaikkiReseptit'>

                            <img className="kuvat"
                                src={recipe.image_url}
                                alt={recipe.title} />

                            <div className='otsikkoKuvaus'>
                                <p className='otsikko'> {recipe.title}</p>
                                <p className='kuvaus'> {recipe.description}</p>
                            </div>


                            <div className='reseptiInfo'>
                                <div className='info'>
                                    <div className='tieto'> Valmisteluaika </div>
                                    <div className='määrä'> {recipe.prep_time} minuuttia </div>
                                </div>

                                <div className='info'>
                                    <div className='tieto'> Annosta </div>
                                    <div className='määrä'> {recipe.servings} </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default KotiSivu