// components/Cart.js
export default function Cart({ cart, totalAmount, onCheckout }) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border max-w-xs">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">🛒</span>
        <div>
          <div className="font-semibold">
            Koszyk: {itemCount} {itemCount === 1 ? 'produkt' : 'produkty'}
          </div>
          <div className="text-blue-600 font-bold">
            {totalAmount.toFixed(2)} zł
          </div>
        </div>
        <button
          onClick={onCheckout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
        >
          Kup teraz
        </button>
      </div>
    </div>
  );
}