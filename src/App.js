import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductContent from './pages/ProductContent';
import OrderContent from './pages/OrderContent';
import Cart from './components/Cart';
import { v4 as uuidv4 } from 'uuid';
import ResponseDialog from './components/ResponseDialog';
import LoadingScreen from './components/LoadingScreen';
import axios from 'axios';
import Cookies from 'js-cookie';
import WarningDialog from './components/WarningDialog';


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenWarningDialog, setIsOpenWarningDialog] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [isAdded, setIsAdded] = useState([]); // State to track whether the product is added to the cart
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const openOrder = () => {
    setIsOrderOpen(true);
  }

  const closeOrder = () => {
    setIsOrderOpen(false);
  }

  const openCart = () => {
    setIsCartOpen(true);
  };

  const increaseCount = () => {
    setCount(prevCount => prevCount + 1);
  }

  const decreaseCount = () => {
    count !== 0 ? setCount(prevCount => prevCount - 1) : setCount(0);
  }

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addToCart = (product) => {
    const updatedCart = [...isAdded];
  
    const index = updatedCart.findIndex(item => item._id === product._id);
  
    if (index !== -1) {
      updatedCart.splice(index, 1);
      decreaseCount()
    } else {
      const productWithQty = { ...product, qty: 1 };
      updatedCart.push(productWithQty);
      increaseCount()
    }
    setIsAdded(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    setIsAdded(prevSelectedProducts => {
      return prevSelectedProducts.map(product => {
        if (product._id === productId && product.qty > 1) {
          return { ...product, qty: product.qty - 1 };
        }
        return product;
      });
    });
  };

  const increaseQuantity = (productId) => {
    setIsAdded(prevSelectedProducts => {
      return prevSelectedProducts.map(product => {
        if (product._id === productId) {
          return { ...product, qty: product.qty + 1 };
        }
        return product;
      });
    });
  };
  
  const calculateTotalQuantity = () => {
    return isAdded.reduce((total, product) => {
      return total + product.qty;
    }, 0);
  };

  const calculateTotalPrice = () => {
    return isAdded.reduce((total, product) => {
      return total + (product.qty * product.price);
    }, 0);
  };

  const generateSessionToken = () => {
      const sessionToken = Cookies.get('session_token');
      if (!sessionToken) {
          const newSessionToken = uuidv4();
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + (1 * 60 * 60 * 1000));
          const expirationTime = expirationDate.toUTCString(); 
          Cookies.set('session_token', newSessionToken); 
          Cookies.set('expiration_time', expirationTime);
      }
  };


  const isSessionTokenExpired = (token) => {
      const expirationTime = Cookies.get('expiration_time');
      if (!expirationTime) {
          return true;
      }
      return new Date(expirationTime) < new Date();
  };

  const checkSessionTokenStatus = () => {
      handlingInterval()
      setInterval(() => {
        handlingInterval()
      }, 60000);
  };

  const deleteAllOrders = async (sessionToken) => {
    try {
        const response = await axios.delete('http://localhost:3000/delete-all-orders?session_token=' + sessionToken);
        console.log('Orders deleted successfully:', response.data);
    } catch (error) {
        console.error('Error deleting orders:', error.message);
    }
  };

  const handlingInterval = () => {
    const sessionToken = Cookies.get('session_token');
    if (sessionToken) {
        if (isSessionTokenExpired(sessionToken)) {
          deleteAllOrders();
          setIsOpenWarningDialog(true)
        }
    } else {
      generateSessionToken()
    }
  }
  
  const closePopUp = () => {
    setIsOpenWarningDialog(false);
    Cookies.remove('session_token');
    Cookies.remove('expiration_time');
    window.location.reload()
  }

  const checkOut = async () => {
    try {
      setPostLoading(true);
      const totalPrice = calculateTotalPrice(); 
      const totalQty = calculateTotalQuantity(); 
      const response = await axios.post('http://localhost:3000/orders', {
        products: isAdded.map(item => ({ product: item._id, qty: item.qty })),
        session_token: Cookies.get('session_token'),
        total_price: totalPrice,
        total_quantity: totalQty,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      if (!response.status === 200) {
        throw new Error('Checkout failed');
      } 
    
      setCount(0);
      setIsAdded([]);
      setCheckoutSuccess(true);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Error during checkout:', error.message);
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      generateSessionToken();
      checkSessionTokenStatus();
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(delay);
  });


  return (
    <div className="App">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className='wrapper'>
          <Header openCart={openCart} closeOrder={closeOrder} openOrder={openOrder} count={count}  />
            <div className="wrapper">
              {isOrderOpen && <OrderContent isOrderOpen={isOrderOpen} checkoutSuccess={checkoutSuccess} isAdded={isAdded} />}
              {!isOrderOpen && <ProductContent addToCart={addToCart} isAdded={isAdded} />}
              <Cart isCartOpen={isCartOpen} addToCart={addToCart} checkOut={checkOut} postLoading={postLoading} checkoutSuccess={checkoutSuccess} calculateTotalPrice={calculateTotalPrice} calculateTotalQuantity={calculateTotalQuantity} decreaseQuantity={decreaseQuantity} increaseQuantity={increaseQuantity} selectedproducts={isAdded} closeCart={closeCart} />
              {checkoutSuccess && <ResponseDialog isOrderOpen={isOrderOpen} openOrder={openOrder} checkoutSuccess={checkoutSuccess} setCheckoutSuccess={setCheckoutSuccess}  />}
            </div>
            <WarningDialog closePopUp={closePopUp} isOpenWarningDialog={isOpenWarningDialog} />
        </div>
        )}
    </div>
  );
}

export default App;
