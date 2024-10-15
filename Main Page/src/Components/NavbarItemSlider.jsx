import React from "react";
import '../style.css';
import NavbarItemSliderContent from "./NavbarItemSliderContent";

function NavbarItemSlider({ clickedElement, cartItems }) {
  return (
      <NavbarItemSliderContent data={clickedElement} cartItems={cartItems} />
  );
}

export default NavbarItemSlider;
