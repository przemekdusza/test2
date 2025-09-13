import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    if (typeof window !== 'undefined') {
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
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl">Ładowanie...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const billingAddress = user.billing_address ? JSON.parse(user.billing_address) : {};
  const shippingAddress = user.shipping_address ? JSON.parse(user.shipping_address) : {};

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Ustawienia profilu</h1>
          
          {/* Dane osobowe */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dane osobowe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Imię</label>
                <p className="text-gray-900 font-medium">{user.first_name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Nazwisko</label>
                <p className="text-gray-900 font-medium">{user.last_name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Telefon</label>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>
              {user.customer_type === 'business' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600">Nazwa firmy</label>
                    <p className="text-gray-900 font-medium">{user.company_name}</p>
                  </div>
                  {user.nip && (
                    <div>
                      <label className="block text-sm text-gray-600">NIP</label>
                      <p className="text-gray-900 font-medium">{user.nip}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Adres rozliczeniowy */}
          {billingAddress && Object.keys(billingAddress).length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Adres rozliczeniowy</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">
                  {billingAddress.street} {billingAddress.houseNumber}
                </p>
                <p className="text-gray-900">
                  {billingAddress.postalCode} {billingAddress.city}
                </p>
              </div>
            </div>
          )}

          {/* Adres wysyłki */}
          {shippingAddress && Object.keys(shippingAddress).length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Adres wysyłki</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {JSON.stringify(shippingAddress) === JSON.stringify(billingAddress) ? (
                  <p className="text-gray-600 italic">Taki sam jak adres rozliczeniowy</p>
                ) : (
                  <>
                    <p className="text-gray-900">
                      {shippingAddress.street} {shippingAddress.houseNumber}
                    </p>
                    <p className="text-gray-900">
                      {shippingAddress.postalCode} {shippingAddress.city}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Akcje */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Historia zamówień
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Powrót do sklepu
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}