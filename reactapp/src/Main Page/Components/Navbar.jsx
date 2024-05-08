import React, { useEffect, useState } from 'react';
import NavbarItem from './NavbarItem';
import NavbarItemSlider from './NavbarItemSlider';
import '../style.css';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const Navbar = ({ darkmode, onCartChange}) => {
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
  const [isElementClicked, setIsElementClicked] = useState(false);
  const [clickedElement, setClickedElement] = useState(null);

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
      const updateCart = async () => {
          const jwtToken = Cookies.get('jwtToken');
          const decodedToken = jwtToken ? jwt_decode(jwtToken) : null;
          const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
          var count = 0;
          if (decodedToken == null) {
              if (existingCart.length > 0) {
                  existingCart.forEach(item => {
                      count = count + item.quantity;
                  });
                  setCartCount(count);
              } else {
                  setCartCount(0);
              }
          } else {
              const response = await fetch(`https://localhost:7061/api/ShoppingCart/get-cart-count?userId=${decodedToken['Id']}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`
                  },
              });
              if (response.status !== 204) {
                  const data = await response.json();
                  setCartCount(data);
              } else {
                  setCartCount(0);
              }
          }
      }
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
    setIsElementClicked(!isElementClicked);
    setClickedElement('shopping-bag');
  };

  const handleMouseOut = () => {
    setIsElementClicked(false);
  }

  return (
    <>
      <div className='header' /*onMouseLeave={handleMouseOut}*/>
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
          <NavbarItemSlider clickedElement={clickedElement}/>
        </div>
      </div>
    </>
  );
}

export default Navbar;
