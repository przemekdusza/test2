import { db } from '../../lib/supabase'

export default async function handler(req, res) {
  // Obsługa CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const { userId } = req.query

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' })
      }

      // Pobierz zamówienia użytkownika
      const orders = await db.getUserOrders(userId)
      return res.status(200).json(orders)
    } catch (error) {
      console.error('Orders API error:', error)
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}