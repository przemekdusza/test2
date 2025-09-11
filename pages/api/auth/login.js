import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  // Obsługa CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { phone, first_name, last_name, email, address } = req.body

      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' })
      }

      // Sprawdź czy użytkownik już istnieje
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database check error:', checkError)
        return res.status(500).json({ error: 'Database error' })
      }

      if (existingUser) {
        // Użytkownik istnieje, zwróć jego dane
        return res.status(200).json({ 
          success: true, 
          user: existingUser,
          message: 'User logged in successfully'
        })
      } else {
        // Nowy użytkownik, stwórz konto
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ 
            phone, 
            first_name, 
            last_name, 
            email, 
            address 
          }])
          .select()
          .single()

        if (createError) {
          console.error('User creation error:', createError)
          return res.status(500).json({ error: 'Failed to create user' })
        }

        return res.status(201).json({ 
          success: true, 
          user: newUser,
          message: 'User registered successfully'
        })
      }
    } catch (error) {
      console.error('Login API error:', error)
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}