import { useState } from 'react'
import { useRouter } from 'next/router'

export default function MobileHeader({ user, cart = [], onLogout, onCheckout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout()
    }
  }

  const handleAvatarClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleMenuItemClick = (action) => {
    setShowUserMenu(false)
    
    switch (action) {
      case 'orders':
        router.push('/orders')
        break
      case 'profile':
        router.push('/profile')
        break
      case 'logout':
        if (onLogout) {
          onLogout()
        }
        break
    }
  }

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || ''
    const last = lastName?.charAt(0)?.toUpperCase() || ''
    return first + last
  }

  return (
    <div>
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="flex items-center justify-between px-4 py-3">
          
          {/* Left side - Quick checkout button (only if cart has items) */}
          <div className="w-12">
            {cart.length > 0 && (
              <button
                onClick={handleCheckoutClick}
                className="relative bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                title="Kup teraz"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m3.6 8L9 13m0 0c-.3-1.3-1.4-2-3-2m3 2v6a2 2 0 104 0v-6m-4 0h6"/>
                </svg>
                
                {/* Badge with item count */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </button>
            )}
          </div>

          {/* Center - Brand name */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-800 tracking-wide">
              RĘCZNIK EXPRESS
            </h1>
          </div>

          {/* Right side - User menu */}
          <div className="w-12 flex justify-end relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={handleAvatarClick}
                  className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {getInitials(user.first_name, user.last_name)}
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop to close menu */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{user.phone}</p>
                        </div>
                        
                        <button
                          onClick={() => handleMenuItemClick('orders')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          📋 Historia zamówień
                        </button>
                        
                        <button
                          onClick={() => handleMenuItemClick('profile')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          ⚙️ Ustawienia profilu
                        </button>
                        
                        <div className="border-t">
                          <button
                            onClick={() => handleMenuItemClick('logout')}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            🚪 Wyloguj się
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Cart summary bar (visible when items in cart) */}
        {cart.length > 0 && (
          <div className="bg-green-50 border-t px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Koszyk: {getTotalItems()} {getTotalItems() === 1 ? 'produkt' : 'produkty'}
              </span>
              <span className="font-bold text-green-700">
                {getTotalAmount().toFixed(2)} zł
              </span>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}