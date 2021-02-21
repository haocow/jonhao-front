import React from 'react';
import logo from "../../../logo.png";

const HeaderLogo = () => {
  return (
    <a href='/'>
      <div className='header-logo'>
        <img alt="logo" src={logo} />
        <div className='header-logo__title'>JonHao</div>
      </div>
    </a>
  );
}

export default HeaderLogo;
