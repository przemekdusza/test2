// pages/api/products.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    const products = [
      { 
        id: 1, 
        name: 'Ręcznik Basic 40x80cm', 
        price: 49.99, 
        description: 'Jednokrotnego użytku',
        active: true
      },
      { 
        id: 2, 
        name: 'Ręcznik Premium 50x90cm', 
        price: 79.99, 
        description: 'Wytrzymały, chłonny',
        active: true
      },
      { 
        id: 3, 
        name: 'Ręcznik XL 60x100cm', 
        price: 99.99, 
        description: 'Duży rozmiar, profesjonalny',
        active: true
      },
      { 
        id: 4, 
        name: 'Zestaw 3 ręczników', 
        price: 199.99, 
        description: 'Pakiet oszczędnościowy',
        active: true
      }
    ];

    res.status(200).json(products);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}