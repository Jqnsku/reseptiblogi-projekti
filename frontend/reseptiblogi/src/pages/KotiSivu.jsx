import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function KotiSivu({ recipes = [] }) {

    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const filtered = recipes.filter(recipe =>
        recipe.title?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            <div className='tietoa'>
                <h2> Viimeisimmät reseptit </h2>
                <p> Löydä herkullisia reseptejä, joita yhteisömme on jakanut </p>
            </div>

            <input
                className='hakupalkki'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Hae resepti nimellä...'
            />

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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default KotiSivu