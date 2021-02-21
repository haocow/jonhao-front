import React from 'react';
import HeaderLogo from './subcomponents/HeaderLogo';
import HeaderTabs from './subcomponents/HeaderTabs';

import './Header.scss';

const tabs = [
  {id: 'plateses', label: 'Plateses', path: '/plateses'},
  {id: 'tests', label: 'Tests', path: '/tests'},
]

const Header = () => {
  return (
    <div className='header'>
      <HeaderLogo />
      <HeaderTabs
        tabs={tabs}
      />
    </div>
  )
};

export default Header;
