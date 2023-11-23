import React, { useEffect, useState } from 'react';
import NavbarItem from './NavbarItem';
import NavbarItemSlider from './NavbarItemSlider';
import '../style.css';
import { Link } from "react-router-dom";

const Navbar = ({darkmode}) => {
  const root = document.documentElement;
  if(darkmode == true){
    root.style.setProperty('--background-color', '#121212');
    root.style.setProperty('--logo-color', '#d0d0d1');
    root.style.setProperty('--icon-color', '#9b9b9b');
    root.style.setProperty('--text-color', '#9e9e9e');
    root.style.setProperty('--hover-color', 'white');
  }else{
    root.style.setProperty('--background-color', 'white');
    root.style.setProperty('--logo-color', '#333333');
    root.style.setProperty('--icon-color', '#6c6c6c');
    root.style.setProperty('--text-color', '#6c6c6c');
    root.style.setProperty('--hover-color', 'black');
  }
  const [categories, setCategories] = useState([]);
  const [isElementClicked, setIsElementClicked] = useState(false);
  const [clickedElement, setClickedElement] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://localhost:7061/api/Categories/getAllCategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryHover = (categoryId) => {
    setIsElementClicked(true);
    setClickedElement(categoryId);
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
            <li className='li1' key={category.id} onMouseOver={() => handleCategoryHover(category.id)}>
              <NavbarItem category={category} />
            </li>
          ))}
          <li className='li1' onMouseOver={handleSearchHover} onClick={handleSearchClick}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </li>
          <li className='li1' onMouseOver={handleShoppingBagHover} onClick={handleShoppingBagClick}>
            <i className="fa-solid fa-bag-shopping"></i>
          </li>
        </ul>
        <div className={`slider ${isElementClicked ? 'visible' : ''}`}>
          <NavbarItemSlider clickedElement={clickedElement} />
        </div>
      </div>
    </>
  );
}

export default Navbar;
