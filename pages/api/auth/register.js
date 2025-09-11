import { db } from '../../../lib/supabase'

export default async function handler(req, res) {
  console.log('Register API called:', req.method, req.body)
  
  // Obsługa CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { 
        phone, 
        first_name, 
        last_name, 
        email, 
        customer_type, 
        company_name, 
        billing_address, 
        shipping_address 
      } = req.body

      if (!phone || !first_name || !last_name) {
        return res.status(400).json({ error: 'Phone, first name and last name are required' })
      }

      console.log('Checking if user exists with phone:', phone)

      // Sprawdź czy użytkownik już istnieje
      const existingUser = await db.getUserByPhone(phone)

      if (existingUser) {
        return res.status(400).json({ error: 'Użytkownik z tym numerem telefonu już istnieje' })
      }

      console.log('Creating new user')

      // Stwórz nowego użytkownika
      const newUser = await db.createUser({
        phone,
        first_name,
        last_name,
        email: email || null,
        customer_type: customer_type || 'private',
        company_name: customer_type === 'business' ? company_name : null,
        billing_address: JSON.stringify(billing_address),
        shipping_address: JSON.stringify(shipping_address)
      })

      console.log('New user created:', newUser)

      return res.status(201).json({
        success: true,
        user: newUser,
        message: 'User registered successfully'
      })

    } catch (error) {
      console.error('Register API error:', error)
      return res.status(500).json({
        error: 'Internal server error',
        details: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}