// pages/api/orders/user/[userId].js
export default function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    // W prawdziwej aplikacji pobierałbyś z bazy danych
    // Na razie zwracamy przykładowe zamówienia
    
    const sampleOrders = [
      {
        id: 1,
        orderNumber: 'ORD-1700000001-123',
        userId: parseInt(userId),
        items: [
          { id: 1, name: 'Ręcznik Basic 40x80cm', price: 49.99, quantity: 2, description: 'Jednokrotnego użytku' },
          { id: 2, name: 'Ręcznik Premium 50x90cm', price: 79.99, quantity: 1, description: 'Wytrzymały, chłonny' }
        ],
        totalAmount: 179.97,
        status: 'delivered',
        createdAt: '2024-01-15T10:30:00.000Z'
      },
      {
        id: 2,
        orderNumber: 'ORD-1700000002-456',
        userId: parseInt(userId),
        items: [
          { id: 4, name: 'Zestaw 3 ręczników', price: 199.99, quantity: 1, description: 'Pakiet oszczędnościowy' }
        ],
        totalAmount: 199.99,
        status: 'shipped',
        createdAt: '2024-01-10T14:20:00.000Z'
      }
    ];

    // Filtruj zamówienia dla tego użytkownika
    const userOrders = sampleOrders.filter(order => order.userId === parseInt(userId));
    
    res.status(200).json(userOrders);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}