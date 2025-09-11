import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Register() {
  const [step, setStep] = useState(1); // 1 = telefon, 2 = weryfikacja, 3 = dane
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Dane użytkownika
  const [userData, setUserData] = useState({
    customerType: 'private', // 'private' lub 'business'
    firstName: '',
    lastName: '',
    companyName: '',
    billingAddress: {
      postalCode: '',
      city: '',
      street: '',
      houseNumber: ''
    },
    shippingAddress: {
      sameAsBilling: true,
      postalCode: '',
      city: '',
      street: '',
      houseNumber: ''
    },
    email: ''
  });

  // Krok 1: Wysłanie SMS
  const handleSendSMS = async (e) => {
    e.preventDefault();
    
    if (!phone.trim() || phone.length < 9) {
      setError('Wprowadź prawidłowy numer telefonu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = `+48${phone.replace(/\s/g, '')}`;
      
      // TODO: Integracja z Twilio
      const response = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(2);
      } else {
        setError(data.error || 'Błąd wysyłania SMS');
      }
    } catch (error) {
      // Tymczasowo - bez Twilio
      console.log('SMS would be sent to:', `+48${phone}`);
      setStep(2);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  // Krok 2: Weryfikacja kodu
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Wprowadź kod weryfikacyjny');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Weryfikacja z Twilio
      // Tymczasowo akceptuj kod "1234"
      if (verificationCode === '1234') {
        setStep(3);
        setError('');
      } else {
        setError('Nieprawidłowy kod weryfikacyjny. Użyj: 1234');
      }
    } catch (error) {
      setError('Błąd weryfikacji kodu');
    } finally {
      setLoading(false);
    }
  };

  // Krok 3: Rejestracja użytkownika
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Walidacja
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      setError('Wprowadź imię i nazwisko');
      return;
    }

    if (userData.customerType === 'business' && !userData.companyName.trim()) {
      setError('Wprowadź nazwę firmy');
      return;
    }

    if (!userData.billingAddress.postalCode || !userData.billingAddress.city || 
        !userData.billingAddress.street || !userData.billingAddress.houseNumber) {
      setError('Wypełnij wszystkie pola adresu');
      return;
    }

    if (!userData.shippingAddress.sameAsBilling && 
        (!userData.shippingAddress.postalCode || !userData.shippingAddress.city || 
         !userData.shippingAddress.street || !userData.shippingAddress.houseNumber)) {
      setError('Wypełnij wszystkie pola adresu wysyłki');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPhone = `+48${phone.replace(/\s/g, '')}`;
      
      const registrationData = {
        phone: fullPhone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        customer_type: userData.customerType,
        company_name: userData.customerType === 'business' ? userData.companyName : null,
        billing_address: userData.billingAddress,
        shipping_address: userData.shippingAddress.sameAsBilling 
          ? userData.billingAddress 
          : userData.shippingAddress
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token || 'authenticated');
        
        // Sprawdź czy ma wrócić do checkout
        const returnTo = router.query.returnTo;
        const cart = localStorage.getItem('cart');
        
        if (returnTo === 'summary' && cart && JSON.parse(cart).length > 0) {
          router.push('/summary');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Błąd rejestracji');
      }
    } catch (error) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 9) {
      setPhone(formatted);
    }
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAddress = (type, field, value) => {
    setUserData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  return (
    <Layout title="Rejestracja - Sklep z Ręcznikami">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Krok 1: Numer telefonu */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Rejestracja</h1>
                <p className="text-gray-600 mt-2">Wprowadź numer telefonu</p>
              </div>

              <form onSubmit={handleSendSMS} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numer telefonu
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      +48
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="123 456 789"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Wysyłanie...' : 'Wyślij kod SMS'}
                </button>
              </form>
            </div>
          )}

          {/* Krok 2: Weryfikacja SMS */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Weryfikacja</h1>
                <p className="text-gray-600 mt-2">
                  Kod wysłano na +48 {phone}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  (Tymczasowo użyj kodu: 1234)
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kod weryfikacyjny
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                    disabled={loading}
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Weryfikacja...' : 'Zweryfikuj kod'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  ← Zmień numer telefonu
                </button>
              </form>
            </div>
          )}

          {/* Krok 3: Dane użytkownika */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dane konta</h1>
                <p className="text-gray-600 mt-2">Uzupełnij swoje dane</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Typ klienta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ klienta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateUserData('customerType', 'private')}
                      className={`py-2 px-4 rounded-lg border ${userData.customerType === 'private' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
                    >
                      Osoba prywatna
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUserData('customerType', 'business')}
                      className={`py-2 px-4 rounded-lg border ${userData.customerType === 'business' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
                    >
                      Firma
                    </button>
                  </div>
                </div>

                {/* Dane osobowe */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imię *
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => updateUserData('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwisko *
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => updateUserData('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Nazwa firmy */}
                {userData.customerType === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nazwa firmy *
                    </label>
                    <input
                      type="text"
                      value={userData.companyName}
                      onChange={(e) => updateUserData('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (opcjonalnie)
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => updateUserData('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                {/* Adres rozliczeniowy */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Adres rozliczeniowy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kod pocztowy *
                      </label>
                      <input
                        type="text"
                        value={userData.billingAddress.postalCode}
                        onChange={(e) => updateAddress('billingAddress', 'postalCode', e.target.value)}
                        placeholder="00-000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miasto *
                      </label>
                      <input
                        type="text"
                        value={userData.billingAddress.city}
                        onChange={(e) => updateAddress('billingAddress', 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ulica *
                      </label>
                      <input
                        type="text"
                        value={userData.billingAddress.street}
                        onChange={(e) => updateAddress('billingAddress', 'street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nr domu *
                      </label>
                      <input
                        type="text"
                        value={userData.billingAddress.houseNumber}
                        onChange={(e) => updateAddress('billingAddress', 'houseNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Adres wysyłki */}
                <div>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={userData.shippingAddress.sameAsBilling}
                      onChange={(e) => updateAddress('shippingAddress', 'sameAsBilling', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="sameAddress" className="text-sm text-gray-700">
                      Adres wysyłki taki sam jak rozliczeniowy
                    </label>
                  </div>

                  {!userData.shippingAddress.sameAsBilling && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Adres wysyłki</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kod pocztowy *
                          </label>
                          <input
                            type="text"
                            value={userData.shippingAddress.postalCode}
                            onChange={(e) => updateAddress('shippingAddress', 'postalCode', e.target.value)}
                            placeholder="00-000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Miasto *
                          </label>
                          <input
                            type="text"
                            value={userData.shippingAddress.city}
                            onChange={(e) => updateAddress('shippingAddress', 'city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ulica *
                          </label>
                          <input
                            type="text"
                            value={userData.shippingAddress.street}
                            onChange={(e) => updateAddress('shippingAddress', 'street', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nr domu *
                          </label>
                          <input
                            type="text"
                            value={userData.shippingAddress.houseNumber}
                            onChange={(e) => updateAddress('shippingAddress', 'houseNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Rejestracja...' : 'Załóż konto'}
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Powrót do logowania
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}