import React, { useEffect, useState } from 'react';
import NavbarItem from './NavbarItem';
import NavbarItemSlider from './NavbarItemSlider';
import '../style.css';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const Navbar = ({ darkmode, onCartChange, removeCart, delay}) => {
  const root = document.documentElement;
  if(darkmode == true){
    root.style.setProperty('--background-color', '#121212');
    root.style.setProperty('--logo-color', '#d0d0d1');
    root.style.setProperty('--icon-color', '#9b9b9b');
    root.style.setProperty('--text-color', '#9e9e9e');
    root.style.setProperty('--text-color2', 'white');
    root.style.setProperty('--hover-color', 'white');
  }else{
    root.style.setProperty('--background-color', 'white');
    root.style.setProperty('--logo-color', '#333333');
    root.style.setProperty('--icon-color', '#6c6c6c');
    root.style.setProperty('--text-color', '#6c6c6c');
    root.style.setProperty('--text-color2', 'black');
    root.style.setProperty('--hover-color', 'black');
  }
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isElementClicked, setIsElementClicked] = useState(false);
  const [clickedElement, setClickedElement] = useState(null);

  const updateCart = async () => {
      try {
          if (removeCart === true) {
              localStorage.removeItem('cart');
          }
          const jwtToken = Cookies.get('jwtToken');
          const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
          const delayTime = delay ? 3000 : 0;
          let count = 0;
          setTimeout(async () => {
              if (decodedToken == null) {
                  const existingCart = removeCart === true ? [] : JSON.parse(localStorage.getItem('cart')) || [];
                  if (existingCart.length > 0) {
                      const response = await fetch('https://localhost:7061/api/ShoppingCart/get-cart-anonymous', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(existingCart),
                      })
                      if (response.ok) {
                          const data = await response.json();
                          setCartItems(data);
                          var cart = [];
                          data.forEach(item => {
                              const cartItem = {
                                  productId: item.id,
                                  color: item.color,
                                  memory: item.memory,
                                  storage: item.storage,
                                  quantity: item.quantity
                              }
                              cart.push(cartItem);
                              count = count + item.quantity;
                          });
                          localStorage.setItem('cart', JSON.stringify(cart));
                          setCartCount(count);
                      } else {
                          setCartItems([]);
                          setCartCount(0);
                      }
                  } else {
                      setCartCount(0);
                      setCartItems([]);
                  }
              } else {
                  const response = await fetch(`https://localhost:7061/api/ShoppingCart/get-cart?userId=${decodedToken['Id']}`, {
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${jwtToken}`
                      },
                  });
                  if (response.ok) {
                      const data = await response.json();
                      setCartItems(data);
                      data.forEach(item => {
                          count = count + item.quantity;
                      });
                      setCartCount(count);
                  } else {
                      setCartItems([]);
                      setCartCount(0);
                  }
              }
          })
      } catch (error) {
          console.error('Failed to fetch cart count:', error);
      }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:7061/api/Category/getAllCategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
      updateCart();
  }, [onCartChange]);

  const handleCategoryHover = (category) => {
    setIsElementClicked(true);
    setClickedElement(category);
  };

  const handleSearchHover = () => {
    if (clickedElement !== 'search') {
      setIsElementClicked(false);
    }
  };

  const handleSearchClick = () => {
    setIsElementClicked(!isElementClicked);
    setClickedElement('search');
  };

  const handleShoppingBagHover = () => {
    if (clickedElement !== 'shopping-bag') {
      setIsElementClicked(false);
    }
  };

  const handleShoppingBagClick = () => {
    if (isElementClicked === false){
      updateCart();
    }
    setIsElementClicked(!isElementClicked);
    setClickedElement('shopping-bag');
  };

  const handleMouseOut = () => {
    setIsElementClicked(false);
  }

  return (
    <>
      <div className='header' onMouseLeave={handleMouseOut}>
        <ul className='header2'>
          <li className='li1'>
            <Link to='/'><i className='fa-brands fa-apple'></i></Link>
          </li>
          {categories.map((category) => (
            <li className='li1' key={category.id} onMouseOver={() => handleCategoryHover(category)}>
              <NavbarItem category={category} />
            </li>
          ))}
          <li className='li1' onMouseOver={handleSearchHover} onClick={handleSearchClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </li>
          <li className='li1' onMouseOver={handleShoppingBagHover} onClick={handleShoppingBagClick}>
            <i className="fa-solid fa-bag-shopping" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'center', width: '12px', height: '10px', background: 'black', position: 'absolute', bottom: '-4px', right: '-6px', borderRadius: '10px'}}>
                <span style={{ color: 'white', fontSize: '8px', textAlign: 'center' }}>{cartCount}</span>
              </div>
            </i>
          </li>
        </ul>
        <div className={`slider ${isElementClicked ? 'visible' : ''}`}>
          <NavbarItemSlider clickedElement={clickedElement} cartItems={cartItems}/>
        </div>
      </div>
    </>
  );
}

export default Navbar;
