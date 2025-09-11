import { db } from '../../../lib/supabase'

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
      const existingUser = await db.getUserByPhone(phone)

      if (existingUser) {
        // Użytkownik istnieje, zwróć jego dane
        return res.status(200).json({ 
          success: true, 
          user: existingUser,
          message: 'User logged in successfully'
        })
      } else {
        // Nowy użytkownik, stwórz konto
        const newUser = await db.createUser({
          phone, 
          first_name, 
          last_name, 
          email, 
          address 
        })

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