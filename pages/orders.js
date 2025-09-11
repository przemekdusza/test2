import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Orders() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Pobierz zamówienia użytkownika
    fetchUserOrders(parsedUser.id)
  }, [])

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`)
      if (response.ok) {
        const userOrders = await response.json()
        setOrders(userOrders)
      } else {
        console.error('Failed to fetch orders')
        setOrders([]) // Pusta lista jeśli błąd
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([]) // Pusta lista jeśli błąd
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600'
      case 'shipped': return 'text-blue-600'
      case 'pending': return 'text-yellow-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Dostarczone'
      case 'shipped': return 'Wysłane'
      case 'pending': return 'Oczekuje'
      case 'cancelled': return 'Anulowane'
      default: return 'Nieznany'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">Ładowanie zamówień...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historia zamówień</h1>
            <p className="text-gray-600 mt-2">Twoje zamówienia i faktury</p>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Zalogowany jako:</p>
              <p className="font-medium">{user.first_name} {user.last_name}</p>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak zamówień</h3>
            <p className="text-gray-500 mb-6">Nie masz jeszcze żadnych zamówień.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Przejdź do sklepu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Zamówienie #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {order.total_amount} zł
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Produkty:</h4>
                  {order.order_items && order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                          {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          {item.products ? item.products.name : `Produkt ID: ${item.product_id}`}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {(item.unit_price * item.quantity).toFixed(2)} zł
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    📄 Pobierz fakturę
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    🔄 Zamów ponownie
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Powrót do sklepu
          </button>
        </div>
      </div>
    </Layout>
  )
}