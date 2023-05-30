import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const carts = localStorage.getItem("cart");
        if (carts?.length) {
            setCart(JSON.parse(carts))
        }
    }, [])

    return (
        <CartContext.Provider value={[cart, setCart]}>{children}</CartContext.Provider>
    )
}

const useCart = () => useContext(CartContext);

export { useCart, CartProvider }