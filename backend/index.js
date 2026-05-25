require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const { supabase } = require('./database.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cors())


if (!process.env.SECRET) {
    throw new Error('SECRET missing')
}

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        return response.status(401).json({
            error: 'Voit kommentoida kirjautumalla sisään'
        })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.SECRET, (error, user) => {
        if (error) {
            return response.status(403).json({
                error: 'Invalid token'
            })
        }
        request.user = user
        next()
    })
}

// app.get('/recipes/:title', async (request, response) => {
//     const { title } = request.params

//     const { data, error } = await supabase
//         .from('recipes')
//         .select('*')
//         .eq('title', title)

//     if (error) {
//         console.error('Error fetching recipes:', error);
//         return response.status(500).json({ error: 'Database error' });
//     }

//     response.json(data);
// })

app.post('/recipes', authenticateToken, async (request, response) => {
    const { title, category, food_type, description, instructions, image_url, prep_time, cook_time, servings } = request.body

    if (!title || !category || !food_type || !description || !instructions || !prep_time || !cook_time || !servings) {
        return response.status(400).json({
            error: 'Missing fields'
        })
    }


    const user_id = request.user.user_id

    const { data, error } = await supabase
        .from('recipes')
        .insert([{
            title,
            category,
            food_type,
            description,
            instructions,
            image_url,
            user_id,
            prep_time,
            cook_time,
            servings
        }])
        .select('*')

    if (error) {
        console.error('Error adding recipes:', error);
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

app.get('/recipe/:recipe_id', async (request, response) => {
    const { recipe_id } = request.params

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('recipe_id', recipe_id)
        .single()

    if (error) {
        console.error('Error fetching recipes:', error);
        return response.status(500).json({ error: 'Database error' });
    }

    response.json(data);
})


app.get('/comments', async (request, response) => {

    const { data, error } = await supabase
        .from('comments')
        .select(`
    *,
    user:user_id(username)
`)

    if (error) {
        console.error('Error fetching users:', error);
        return response.status(500).json({ error: 'Database error' });
    }

    response.json(data);
})

app.post('/comments', authenticateToken, async (request, response) => {
    const { recipe_id, content } = request.body

    if (!content) {
    return response.status(400).json({
        error: 'Comment is required'
    })
}

    const user_id = request.user.user_id

    const { data, error } = await supabase
        .from('comments')
        .insert([{ recipe_id, user_id, content }])
        .select(`
    *,
    user:user_id(username)
`)

    if (error) {
        console.error('Error adding comments:', error);
        return response.status(500).json({ error: 'Database error' });
    }

    response.json(data);
})

// app.post('/comments', async (request, response) => {
//     const { recipe_id, user_id, content } = request.params

//     const { data, error } = await supabase
//         .from('comments')
//         .insert([{ recipe_id, user_id, content }])
//         .select('*')

//     if (error) {
//         console.error('Error adding comments:', error);
//         return response.status(500).json({ error: 'Database error' });
//     }

//     response.json(data);
// })

app.get('/user', async (request, response) => {

    const { data, error } = await supabase
        .from('user')
        .select('user_id, username')

    if (error) {
        console.error('Error fetching users:', error);
        return response.status(500).json({ error: 'Database error' });
    }

    response.json(data);
})

app.post('/register', async (request, response) => {
    const { username, password, email } = request.body

    
    if (!username || !password || !email) {
        return response.status(400).json({ error: 'Missing fields' })
    }
    
    if (password.length < 6) {
    return response.status(400).json({
        error: 'Password must be at least 6 characters'
    })
}
    if (typeof username !== 'string' || typeof password !== 'string' || typeof email !== 'string') {

        return response.status(400).json({ error: 'Invalid input type' })
    }

    const { data: existsUser } = await supabase
        .from('user')
        .select('*')
        .eq('username', username)

    if (existsUser && existsUser.length > 0) {
        return response.status(409).json({ error: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
        .from('user')
        .insert([{ username, password: hashedPassword, email }])

    if (error) {
        return response.status(500).json({ error: 'Database error' })
    }

    return response.status(201).json({ message: 'User created' })

})

app.post('/login', async (request, response) => {
    const { username, password } = request.body

    if (!username || !password) {
        return response.status(400).json({ error: 'Missing fields' })
    }

    const { data: user, error } = await supabase
        .from('user')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !user) {
        return response.status(404).json({ error: 'User not found' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return response.status(401).json({ error: 'Wrong password' })
    }

    const token = jwt.sign(
        {
            user_id: user.user_id,
            username: user.username
        }, process.env.SECRET,
        { expiresIn: '7d' })

    return response.status(200).json({
        message: 'Login successful',
        token,
        user: {
            user_id: user.user_id,
            username: user.username
        }
    })
})


app.post('/guest', async (request, response) => {
    const guestUser = {
        user_id: Date.now(),
        username: 'guest',
        xp: 0,
        isGuest: true
    }

    return response.status(200).json({
        message: 'Guest login successful',
        user: guestUser
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})