import { db } from '../../../lib/supabase'

export default async function handler(req, res) {
  console.log('Verify login API called:', req.method, req.body)
  
  // Obsługa CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { phone, code } = req.body

      if (!phone || !code) {
        return res.status(400).json({ error: 'Phone and code are required' })
      }

      console.log('Verifying login for phone:', phone, 'with code:', code)

      // TODO: Weryfikacja kodu z Twilio
      // Tymczasowo akceptuj kod "1234"
      if (code !== '1234') {
        return res.status(400).json({ error: 'Invalid verification code' })
      }

      // Pobierz użytkownika z bazy
      const user = await db.getUserByPhone(phone)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      console.log('User logged in successfully:', user)

      return res.status(200).json({
        success: true,
        user: user,
        message: 'User logged in successfully'
      })

    } catch (error) {
      console.error('Verify login API error:', error)
      return res.status(500).json({
        error: 'Internal server error',
        details: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}