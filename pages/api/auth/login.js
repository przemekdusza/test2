// pages/api/auth/login.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brak numeru telefonu' 
      });
    }

    // Symulacja użytkowników w bazie
    const users = [
      {
        id: 1,
        firstName: 'Anna',
        lastName: 'Kowalska',
        phone: '+48123456789',
        email: 'anna@example.com'
      },
      {
        id: 2,
        firstName: 'Piotr',
        lastName: 'Nowak',
        phone: '+48987654321',
        email: 'piotr@example.com'
      }
    ];

    const user = users.find(u => u.phone === phone);

    if (user) {
      // Wygeneruj prosty token
      const token = `token_${user.id}_${Date.now()}`;
      
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Nie znaleziono użytkownika z tym numerem telefonu'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}