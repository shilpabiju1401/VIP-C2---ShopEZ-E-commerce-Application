import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);

  // Helper: calculate total for guest cart
  const calculateGuestTotal = (items) => {
    let total = 0;
    items.forEach(item => {
      if (item.productId) {
        const price = item.productId.price;
        const discount = item.productId.discount || 0;
        const finalPrice = price - (price * (discount / 100));
        total += finalPrice * item.quantity;
      }
    });
    return parseFloat(total.toFixed(2));
  };

  // Fetch Cart (Server or LocalStorage)
  const fetchCart = async () => {
    setLoading(true);
    if (user) {
      try {
        const res = await api.get('/cart');
        setCart(res.data);
      } catch (err) {
        console.error('Failed to fetch server cart', err);
      }
    } else {
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        try {
          setCart(JSON.parse(guestCart));
        } catch (e) {
          localStorage.removeItem('guest_cart');
        }
      } else {
        setCart({ items: [], totalPrice: 0 });
      }
    }
    setLoading(false);
  };

  // Sync / Migrate guest cart to server upon login
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        const guestCartStr = localStorage.getItem('guest_cart');
        if (guestCartStr) {
          try {
            const guestCart = JSON.parse(guestCartStr);
            if (guestCart.items && guestCart.items.length > 0) {
              // Upload items to server cart sequentially
              for (const item of guestCart.items) {
                await api.post('/cart', {
                  productId: item.productId._id,
                  quantity: item.quantity,
                  size: item.size
                });
              }
              localStorage.removeItem('guest_cart');
            }
          } catch (e) {
            console.error('Error syncing guest cart', e);
          }
        }
        fetchCart();
      } else {
        fetchCart();
      }
    };
    syncCart();
  }, [user]);

  // Add Item to Cart
  const addToCart = async (product, quantity, size = '') => {
    if (user) {
      try {
        const res = await api.post('/cart', {
          productId: product._id,
          quantity,
          size
        });
        setCart(res.data);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to add item to cart'
        };
      }
    } else {
      // Manage local cart
      const updatedItems = [...cart.items];
      const existingIdx = updatedItems.findIndex(
        item => item.productId._id === product._id && item.size === size
      );

      if (existingIdx > -1) {
        updatedItems[existingIdx].quantity = quantity;
      } else {
        updatedItems.push({
          productId: {
            _id: product._id,
            title: product.title,
            price: product.price,
            discount: product.discount,
            images: product.images,
            brand: product.brand,
            stock: product.stock
          },
          quantity,
          size
        });
      }

      const newCart = {
        items: updatedItems,
        totalPrice: calculateGuestTotal(updatedItems)
      };

      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return { success: true };
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (productId, size = '') => {
    if (user) {
      try {
        const res = await api.delete(`/cart/${productId}?size=${size}`);
        setCart(res.data);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to remove item'
        };
      }
    } else {
      const updatedItems = cart.items.filter(
        item => !(item.productId._id === productId && item.size === size)
      );

      const newCart = {
        items: updatedItems,
        totalPrice: calculateGuestTotal(updatedItems)
      };

      setCart(newCart);
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return { success: true };
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (user) {
      try {
        const res = await api.delete('/cart');
        setCart(res.data);
      } catch (err) {
        console.error('Failed to clear cart', err);
      }
    } else {
      const emptyCart = { items: [], totalPrice: 0 };
      setCart(emptyCart);
      localStorage.removeItem('guest_cart');
    }
  };

  // Get total count of items in cart
  const getCartCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
