import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import kello from '../assets/kello.svg'
import ihminen from '../assets/ihminen.svg'

const NewRecipeForm = ({ addRecipe,
    categories, foodTypes, newTitle,
    newDescription, newIngredients, newInstructions,
    imageUrl, newPrepTime, newCookTime, newCategory,
    newFoodType, newServings, handleTitleChange, handleDescriptionChange,
    handleIngredientsChange, handleInstructionChange,
    handleImageUpload, handlePrepTimeChange,
    handleCookTimeChange, handleServingsChange, handleCategoryChange,
    handleFoodTypeChange, setNewCategory
}) => {
    return (
        <form onSubmit={addRecipe}>
            <div>
                Reseptin nimi: <input value={newTitle} onChange={handleTitleChange} />
            </div>
            <div>
                Kuvaus: <input value={newDescription} onChange={handleDescriptionChange} />
            </div>
            <div>
                Ainekset: <input value={newIngredients} onChange={handleIngredientsChange} />
            </div>
            <div>
                Ohjeet: <input value={newInstructions} onChange={handleInstructionChange} />
            </div>
            <div>
                Valmisteluaika: <input placeholder='min' value={newPrepTime} onChange={handlePrepTimeChange} />
            </div>
            <div>
                Kokkausaika: <input placeholder='min' value={newCookTime} onChange={handleCookTimeChange} />
            </div>
            <div>
                Annoksia: <input value={newServings} onChange={handleServingsChange} />
            </div>
            <div>
                Kuva: <input type='file' accept='image/*' onChange={handleImageUpload} />
            </div>
            <div>
                Kategoria:
                <select value={newCategory} onChange={handleCategoryChange}>
                    <option value=""> Valitse kategoria </option>

                    {categories
                        // .filter(cat => cat && cat.name)
                        .map((cat, i) => (
                            <option key={i} value={cat}>
                                {cat}
                            </option>
                        ))}
                </select>
            </div>
            <div className='uusi-kategoria'>
                Tai lisää uusi:

                <input
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    placeholder='Uusi kategoria'
                />
            </div>
            <div className='valitse-tyyppi'>
                Ruoantyyppi:
                <select value={newFoodType} onChange={handleFoodTypeChange}>
                    <option value=""> Valitse tyyppi </option>

                    {foodTypes
                        .filter(type => type)
                        .map((type, i) => (
                            <option key={i} value={type}>
                                {type}
                            </option>
                        ))}
                </select>
            </div>
            <button type='submit'> Lisää uusi resepti </button>
        </form>
    )
}

{/* <input value={newCategory} onChange={handleCategoryChange} /> */ }
//  <input value={newFoodType} onChange={handleFoodTypeChange} />

function KotiSivu({ recipes = [], setRecipes, user, isLogged, token }) {

    const [showRecipeForm, setShowRecipeForm] = useState(false)
    const [showRecipeModal, setShowRecipeModal] = useState(false)

    const [search, setSearch] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newIngredients, setNewIngredients] = useState('')
    const [newInstructions, setNewInstructions] = useState('')

    const [newPrepTime, setNewPrepTime] = useState('')
    const [newCookTime, setNewCookTime] = useState('')
    const [newServings, setNewServings] = useState('')

    const [newCategory, setNewCategory] = useState('')
    const [newFoodType, setNewFoodType] = useState('')

    const [imageUrl, setImageUrl] = useState('')

    const [error, setError] = useState(null)

    const [categories, setCategories] = useState([])
    const [foodTypes, setFoodTypes] = useState([])

    const navigate = useNavigate()

    const handleTitleChange = (event) => setNewTitle(event.target.value)
    const handleDescriptionChange = (event) => setNewDescription(event.target.value)
    const handleIngredientsChange = (event) => setNewIngredients(event.target.value)
    const handleInstructionChange = (event) => setNewInstructions(event.target.value)
    const handlePrepTimeChange = (event) => setNewPrepTime(event.target.value)
    const handleCookTimeChange = (event) => setNewCookTime(event.target.value)
    const handleServingsChange = (event) => setNewServings(event.target.value)
    const handleFoodTypeChange = (event) => setNewFoodType(event.target.value)

    // const handleCategoryChange = (event) => setNewCategory(event.target.value)
    // const handleImageChange = (event) => setNewImage(event.target.value)

    useEffect(() => {
        axios.get('http://localhost:3001/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get('http://localhost:3001/food-types')
            .then(res => setFoodTypes(res.data))
            .catch(err => console.log(err))
    }, [])

    const handleCategoryChange = (e) => {
        const value = e.target.value
        setNewCategory(value)

        if (value && !categories.includes(value)) {
            // setCategories(prev => [...prev, value])
        }
    }

    const filtered = recipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(search.toLowerCase())
    )

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        const fileName = `${Date.now()}-${file.name}`

        const { data, error } = await supabase.storage
            .from('recipe_images')
            .upload(fileName, file)

        console.log("DATA:", data)
        console.log("ERROR:", error)

        if (error) {
            console.error("UPLOAD ERROR:", error)
            return
        }

        const { data: urlData } = supabase.storage
            .from('recipe_images')
            .getPublicUrl(fileName)

        setImageUrl(urlData.publicUrl)
    }

    const addRecipe = async (event) => {
        event.preventDefault()


        const newRecipeObject = {
            title: newTitle,
            description: newDescription,
            ingredients: newIngredients,
            instructions: newInstructions,
            image_url: imageUrl,
            prep_time: Number(newPrepTime),
            cook_time: Number(newCookTime),
            servings: Number(newServings),
            category: newCategory,
            food_type: newFoodType
        }

        if (
            !newTitle ||
            !newDescription ||
            !newIngredients ||
            !newInstructions ||
            newPrepTime === '' ||
            newCookTime === '' ||
            newServings === ''
        ) {
            alert("Täytä kaikki kentät")
            return
        }

        try {
            const response = await axios.post(
                'http://localhost:3001/recipes',
                newRecipeObject,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const updated = await axios.get('http://localhost:3001/recipes')
            setRecipes(updated.data)

            setShowRecipeModal(false)

            setNewTitle('')
            setNewDescription('')
            setNewIngredients('')
            setNewInstructions('')
            setNewPrepTime('')
            setNewCookTime('')
            setNewServings('')
            setImageUrl('')
            setNewCategory('')
            setNewFoodType('')

            setShowRecipeModal(false)
            // alert("Resepti lisätty!")

        } catch (error) {
            console.log("ADD RECIPE ERROR:", error.response?.data)
            setError(error.response?.data?.error || "Tallennus epäonnistui")
        } finally {
            setShowRecipeModal(false)
        }
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
                {isLogged &&
                    <div className='uusi-resepti'>
                        <p> Lisää uusi resepti </p>

                        <button className='resepti-nappi'
                            onClick={() => setShowRecipeModal(true)}>
                            +
                        </button>
                    </div>
                }
            </div>

            {isLogged && showRecipeModal && (
                <div className='resepti-modal-overlay' onClick={() => setShowRecipeModal(false)} >
                    <div className='resepti-modal' onClick={(event) => event.stopPropagation()} >

                        <div className='resepti-modal-header'>
                            <h2> Lisää resepti</h2>
                            <button onClick={() => setShowRecipeModal(false)}> X </button>
                        </div>

                        {error && (
                            <p style={{ color: "red" }}>
                                {error}
                            </p>
                        )}

                        <NewRecipeForm
                            addRecipe={addRecipe}

                            categories={categories}
                            foodTypes={foodTypes}
                            setNewCategory={setNewCategory}

                            newTitle={newTitle}
                            newDescription={newDescription}
                            newIngredients={newIngredients}
                            newInstructions={newInstructions}
                            imageUrl={imageUrl}
                            newPrepTime={newPrepTime}
                            newCookTime={newCookTime}
                            newServings={newServings}
                            newCategory={newCategory}
                            newFoodType={newFoodType}

                            handleTitleChange={handleTitleChange}
                            handleDescriptionChange={handleDescriptionChange}
                            handleIngredientsChange={handleIngredientsChange}
                            handleInstructionChange={handleInstructionChange}
                            handleImageUpload={handleImageUpload}

                            handlePrepTimeChange={handlePrepTimeChange}
                            handleCookTimeChange={handleCookTimeChange}
                            handleServingsChange={handleServingsChange}

                            handleCategoryChange={handleCategoryChange}
                            handleFoodTypeChange={handleFoodTypeChange}
                        />
                    </div>
                </div>
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
                                alt={recipe.title}
                            />

                            <div className='otsikko-kuvaus'>
                                <p className='otsikko'> {recipe.title}</p>
                                <p className='kuvaus'> {recipe.description}</p>



                                <div className='resepti-info'>
                                    <div className='info'>
                                        <div className='kortti-tieto'>
                                            <img src={kello} alt='kello' className='kello-icon' />
                                            <div className='määrä'> {recipe.prep_time} minuuttia </div>
                                        </div>
                                    </div>

                                    <div className='kortti-info'>
                                        <div className='tieto'>
                                            <img src={ihminen} alt='ihminen' className='ihminen-icon' />
                                            <div className='määrä'> {recipe.servings} annoksia </div>
                                        </div>
                                    </div>
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