import React from 'react';
import '../style.css';
import { Link, useNavigate } from "react-router-dom";

const NavbarItem = ({ category }) => {
  let navigate = useNavigate(); 

  const routeChange = (name) => {
      let formattedName = name.replace(/\s+/g, '-');
      let path = `/${formattedName.toLowerCase()}`;
      navigate(path);
  }

  return (
    <p onClick={() => routeChange(category.categoryName)}>{category.categoryName}</p>
  );
};
  
export default NavbarItem;