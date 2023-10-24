import React from "react";
import '../style.css';
import NavbarItemSliderContent from "./NavbarItemSliderContent";

function NavbarItemSlider({ clickedElement }) {
  return (
      <NavbarItemSliderContent data={clickedElement}/>
  );
}

export default NavbarItemSlider;
