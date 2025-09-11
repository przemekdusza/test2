// components/ProductCard.js
export default function ProductCard({ product, cartItem, onAddToCart, onUpdateQuantity }) {
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
        <span className="text-4xl">🧻</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {product.name}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {product.description}
      </p>
      
      <div className="text-2xl font-bold text-blue-600 mb-4">
        {product.price.toFixed(2)} zł
      </div>
      
      {quantity === 0 ? (
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Dodaj do koszyka
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
            >
              -
            </button>
            <span className="font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
            >
              +
            </button>
          </div>
          <span className="font-semibold text-blue-600">
            {(product.price * quantity).toFixed(2)} zł
          </span>
        </div>
      )}
    </div>
  );
}