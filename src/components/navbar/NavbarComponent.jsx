import React, { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./navbar.css";
import {SiBankofamerica} from "react-icons/si"

function NavbarComponent(props) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", changeWidth);
  }, []);
  return (
    <nav className="slide-left">
      {(toggleMenu || screenWidth > 500) && (
          
        <ul className="list">
        <Link className='link navbar-brand' to={"/"}><SiBankofamerica></SiBankofamerica> E-bank</Link>
          

          <li className="items">
            <Link className="link" to={"/"}>Početna</Link>
          </li>
         {props.isLoggedIn ? <>        <li className="items">
            {props.isLoggedIn ? <Link className="link"  to={"/izvestaji"}>Izveštaji</Link> : ""}
          </li>
          <li className="items">
            {props.isLoggedIn ?  <Link className="link"  to={"/pravnaLica"}>Pravna lica</Link> : ""}
          </li>
        
          <li className="items logout">
            {props.isLoggedIn ? (

              <Link className="link"  to={"/"} onClick={props.logout}>Odjava</Link>
            ) : (
              ""
            )}
          </li></> : <></>} 
  
        </ul>
      )}

      <button onClick={toggleNav} className="btn-nav">
        <AiOutlineMenu></AiOutlineMenu>
      </button>
    </nav>
  );
}

export default NavbarComponent;
