import React from 'react';
import classnames from 'classnames';
import logo from '../../logo.png';

import './Header.scss';

const Header = () => {
  const classNames = classnames('header');

  return (
    <div className={classNames}>
      <div className='header-logo'>
        <img alt="logo" src={logo} />
        <div className='header-logo__title'>JonHao</div>
      </div>
    </div>
  )
};

export default Header;
