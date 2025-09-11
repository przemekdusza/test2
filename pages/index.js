import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Załaduj produkty przy starcie
  useEffect(() => {
    fetchProducts();
    loadUserFromStorage();
    loadCartFromStorage();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Błąd ładowania produktów:', error);
      // Fallback produkty
      setProducts([
        { id: 1, name: 'Ręcznik Basic 40x80cm', price: 49.99, description: 'Jednokrotnego użytku' },
        { id: 2, name: 'Ręcznik Premium 50x90cm', price: 79.99, description: 'Wytrzymały, chłonny' },
        { id: 3, name: 'Ręcznik XL 60x100cm', price: 99.99, description: 'Duży rozmiar' },
        { id: 4, name: 'Zestaw 3 ręczników', price: 199.99, description: 'Pakiet oszczędnościowy' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFromStorage = () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    }
  };

  const loadCartFromStorage = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          localStorage.removeItem('cart');
        }
      }
    }
  };

  const saveCartToStorage = (newCart) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    saveCartToStorage(newCart);
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
    saveCartToStorage(newCart);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const goToCheckout = () => {
    if (user) {
      router.push('/summary');
    } else {
      router.push('/login');
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl">Ładowanie produktów...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Ręczniki Włókninowe dla Salonów
            </h1>
            <p className="text-gray-600 mt-2">
              Profesjonalne ręczniki dla salonów fryzjerskich i kosmetycznych
            </p>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Witaj, {user.firstName}!
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Wyloguj
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Zaloguj się
            </button>
          )}
        </div>

        {/* Produkty */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={cart.find(item => item.id === product.id)}
              onAddToCart={addToCart}
              onUpdateQuantity={updateCartQuantity}
            />
          ))}
        </div>

        {/* Widget koszyka */}
        {cart.length > 0 && (
          <Cart
            cart={cart}
            totalAmount={getTotalAmount()}
            onCheckout={goToCheckout}
          />
        )}
      </div>
    </Layout>
  );
}