import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Summary() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUserAndCart();
  }, []);

  const loadUserAndCart = () => {
    // Załaduj użytkownika
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        router.push('/login');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    // Załaduj koszyk
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
        if (cartData.length === 0) {
          router.push('/');
        }
      } catch (e) {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    let newCart;
    if (newQuantity <= 0) {
      newCart = cart.filter(item => item.id !== productId);
    } else {
      newCart = cart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    if (newCart.length === 0) {
      router.push('/');
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Tutaj będzie integracja z prawdziwą płatnością (Stripe)
      // Na razie symulujemy płatność
      
      const orderData = {
        user: user,
        items: cart,
        totalAmount: getTotalAmount(),
        timestamp: new Date().toISOString()
      };

      // Symulacja opóźnienia płatności
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Wyczyść koszyk po udanej płatności
      localStorage.removeItem('cart');
      
      // Przekieruj do strony podziękowania lub głównej
      alert(`Płatność zakończona sukcesem!\n\nKwota: ${getTotalAmount().toFixed(2)} zł\nZamówienie zostało złożone.`);
      router.push('/');
      
    } catch (error) {
      alert('Błąd podczas płatności. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl">Ładowanie...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Podsumowanie zamówienia - Sklep z Ręcznikami">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Podsumowanie zamówienia
              </h1>
              <p className="text-gray-600">
                Sprawdź swoje zamówienie przed płatnością
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista produktów */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                🛒 Twój koszyk ({getTotalItems()} {getTotalItems() === 1 ? 'produkt' : 'produkty'})
              </h2>
              
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-2xl">🧻</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-500">Cena: {item.price.toFixed(2)} zł/szt</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center space-x-2 mb-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-blue-600 font-bold">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Podsumowanie i płatność */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-6">💰 Podsumowanie</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Wartość produktów:</span>
                  <span>{getTotalAmount().toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between">
                  <span>Dostawa:</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Razem do zapłaty:</span>
                  <span className="text-blue-600">{getTotalAmount().toFixed(2)} zł</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mb-4 transition-colors"
              >
                {loading ? 'Przetwarzanie...' : `💳 Zapłać ${getTotalAmount().toFixed(2)} zł`}
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Powrót do sklepu
              </button>

              {/* Dane użytkownika */}
              {user && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">👤 Dane zamawiającego</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{user.firstName} {user.lastName}</div>
                    <div>{user.phone}</div>
                    {user.email && <div>{user.email}</div>}
                  </div>
                </div>
              )}

              {/* Informacje o zamówieniu */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">📋 Informacje</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>• Płatność online przez Stripe</div>
                  <div>• Darmowa dostawa</div>
                  <div>• Czas realizacji: 1-2 dni robocze</div>
                  <div>• Faktura VAT wysyłana na email</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}