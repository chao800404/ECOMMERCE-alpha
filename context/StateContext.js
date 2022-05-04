/** @format */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setTotalPrice(
      (prevTotalPrice) =>
        (prevTotalPrice = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ))
    );
    setTotalQuantities(
      (prevTotalQuantities) =>
        (prevTotalQuantities = cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        ))
    );
  }, [cartItems]);

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    setCartItems((prev) => {
      if (!product) return;
      return prev.filter((item) => item._id !== product._id);
    });
  };

  const toggleCartItemQuantity = (id, value) => {
    if (value === "inc") {
      setCartItems((prev) => {
        const existItem = prev.some((item) => item._id === id);
        if (existItem) {
          return prev.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
      });
    } else if (value === "dec") {
      setCartItems((prev) => {
        const existItem = prev.some((item) => item._id === id);
        if (existItem) {
          return prev.map((item) =>
            item._id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
      });
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
