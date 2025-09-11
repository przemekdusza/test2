// pages/api/auth/login.js - używa Supabase
import { db } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brak numeru telefonu' 
      })
    }

    try {
      // Sprawdź czy użytkownik istnieje w bazie Supabase
      const user = await db.getUserByPhone(phone)

      if (user) {
        // Wygeneruj prosty token
        const token = `token_${user.id}_${Date.now()}`
        
        res.status(200).json({
          success: true,
          token,
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            email: user.email
          }
        })
      } else {
        res.status(404).json({
          success: false,
          error: 'Nie znaleziono użytkownika z tym numerem telefonu'
        })
      }
    } catch (error) {
      console.error('Błąd logowania:', error)
      
      // Fallback - symulacja użytkowników jeśli baza nie działa
      const fallbackUsers = [
        {
          id: 1,
          first_name: 'Anna',
          last_name: 'Kowalska',
          phone: '+48123456789',
          email: 'anna@example.com'
        },
        {
          id: 2,
          first_name: 'Piotr',
          last_name: 'Nowak',
          phone: '+48987654321',
          email: 'piotr@example.com'
        }
      ]

      const fallbackUser = fallbackUsers.find(u => u.phone === phone)

      if (fallbackUser) {
        const token = `fallback_token_${fallbackUser.id}_${Date.now()}`
        
        res.status(200).json({
          success: true,
          token,
          user: {
            id: fallbackUser.id,
            firstName: fallbackUser.first_name,
            lastName: fallbackUser.last_name,
            phone: fallbackUser.phone,
            email: fallbackUser.email
          }
        })
      } else {
        res.status(404).json({
          success: false,
          error: 'Nie znaleziono użytkownika z tym numerem telefonu'
        })
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}