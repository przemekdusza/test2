import { supabase } from '../../lib/supabase'

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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ 
          error: 'Database error', 
          details: error.message 
        })
      }

      return res.status(200).json(data)
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Internal server error', 
        details: error.message 
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}