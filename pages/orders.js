import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserAndOrders();
  }, []);

  const loadUserAndOrders = async () => {
    // Sprawdź czy użytkownik jest zalogowany
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Załaduj zamówienia użytkownika
      await fetchUserOrders(userData.id);
    } catch (e) {
      router.push('/login');
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`/api/orders/user/${userId}`);
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        // Jeśli API nie działa, użyj danych z localStorage
        loadOrdersFromStorage();
      }
    } catch (error) {
      console.error('Błąd ładowania zamówień:', error);
      loadOrdersFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersFromStorage = () => {
    // Fallback - załaduj zamówienia z localStorage
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      try {
        const ordersData = JSON.parse(savedOrders);
        setOrders(ordersData.filter(order => order.userId === user?.id));
      } catch (e) {
        setOrders([]);
      }
    }
    setLoading(false);
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/invoice/${orderId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faktura-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Błąd pobierania faktury');
      }
    } catch (error) {
      console.error('Błąd pobierania faktury:', error);
      alert('Błąd pobierania faktury');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Oczekujące' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Opłacone' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Wysłane' },
      delivered: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Dostarczone' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Anulowane' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl">Ładowanie zamówień...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Historia zamówień - Sklep z Ręcznikami">
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Historia zamówień
                </h1>
                <p className="text-gray-600">
                  Twoje zamówienia i faktury
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Zalogowany jako:</p>
                <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
          </div>

          {/* Lista zamówień */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Brak zamówień
              </h2>
              <p className="text-gray-600 mb-6">
                Nie masz jeszcze żadnych zamówień w historii.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Przejdź do sklepu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Zamówienie #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <div className="text-lg font-bold text-blue-600 mt-1">
                        {order.totalAmount.toFixed(2)} zł
                      </div>
                    </div>
                  </div>

                  {/* Produkty w zamówieniu */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Produkty:</h4>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">🧻</span>
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Akcje */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      📄 Pobierz fakturę
                    </button>
                    
                    <button
                      onClick={() => {
                        // Dodaj produkty z zamówienia do koszyka
                        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                        order.items.forEach(item => {
                          const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
                          if (existingItem) {
                            existingItem.quantity += item.quantity;
                          } else {
                            currentCart.push({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              description: item.description || '',
                              quantity: item.quantity
                            });
                          }
                        });
                        localStorage.setItem('cart', JSON.stringify(currentCart));
                        router.push('/');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🛒 Zamów ponownie
                    </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (confirm('Czy na pewno chcesz anulować to zamówienie?')) {
                            // Tutaj API do anulowania zamówienia
                            alert('Funkcja anulowania zostanie dodana');
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        ❌ Anuluj
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Powrót */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Powrót do sklepu
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}