import React from 'react';
import '../style.css';

const NavbarItem = ({ category }) => {
  return (
    <p>{category.categoryName}</p>
  );
};
  
export default NavbarItem;