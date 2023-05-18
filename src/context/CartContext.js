
import { createContext, useEffect, useState } from 'react';

const CartContext = createContext()

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        // Retrieve cart data from browser storage on component mount
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);
    
    useEffect(() => {
        // Check if the cartItems array is not empty
        if (cartItems.length > 0) {
          // Store cart data in browser storage whenever it changes and cartItems is not empty
          localStorage.setItem('cartItems', JSON.stringify(cartItems))
        }
        else {
            localStorage.removeItem('cartItems')
        }
      }, [cartItems]);

    const addToCart = (itemId) => {
        if (!cartItems.includes(itemId)) {
            setCartItems((prevCartItems) => [...prevCartItems, itemId]);
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevCartItems) =>
            prevCartItems.filter((item) => item !== itemId)
        );
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}

export { CartProvider, CartContext };
