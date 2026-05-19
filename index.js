const cors = require('cors')
const express = require('express')
const app = express()
const { supabase } = require('./database.js')

app.use(express.json())
app.use(cors())

app.get('/recipes/:title', async (request, response) => {
    const { title } = request.params

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('title', title)

    if (error) {
        console.error('Error fetching recipes:', error);
        return response.status(500).json({ error: 'Database error' });
    }

    response.json(data);
})

app.get('/recipes', async (request, response) => {

    const { data, error } = await supabase
        .from('recipes')
        .select('*')

    if (error) {
        console.error('Error fetching recipes:', error);
        return response.status(500).json({ error: 'Database error' });
    }

    response.json(data);
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})