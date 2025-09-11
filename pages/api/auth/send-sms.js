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

      console.log('SMS would be sent to:', phone)

      // TODO: Integracja z Twilio
      // const client = twilio(accountSid, authToken)
      // const message = await client.messages.create({
      //   body: 'Twój kod weryfikacyjny: 1234',
      //   from: '+1234567890',
      //   to: phone
      // })

      // Tymczasowa symulacja
      return res.status(200).json({
        success: true,
        message: 'SMS sent successfully'
      })

    } catch (error) {
      console.error('SMS API error:', error)
      return res.status(500).json({
        error: 'Failed to send SMS',
        details: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}