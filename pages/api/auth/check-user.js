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
      const { phone } = req.body

      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' })
      }

      console.log('Checking if user exists with phone:', phone)

      // Sprawdź czy użytkownik istnieje
      const existingUser = await db.getUserByPhone(phone)

      return res.status(200).json({
        exists: !!existingUser,
        phone: phone
      })

    } catch (error) {
      console.error('Check user API error:', error)
      return res.status(500).json({
        error: 'Internal server error',
        details: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}