// pages/api/orders/create.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { user, items, totalAmount } = req.body;

    if (!user || !items || !totalAmount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brakuje wymaganych danych' 
      });
    }

    // Generuj numer zamówienia
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Utwórz zamówienie
    const order = {
      id: Date.now(),
      orderNumber,
      userId: user.id,
      userEmail: user.email,
      userPhone: user.phone,
      userName: `${user.firstName} ${user.lastName}`,
      items,
      totalAmount,
      status: 'paid', // Po płatności
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // W prawdziwej aplikacji zapisałbyś to do bazy danych
    // Na razie symulujemy zapis
    
    res.status(200).json({
      success: true,
      order
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}