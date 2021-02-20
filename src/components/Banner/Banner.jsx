import React from 'react';

import classnames from 'classnames';

import './Banner.scss';

const Banner = () => {
  const classNames = classnames('banner');

  return (
    <div className={classNames}>
      I AM TECHNICALLY A BANNER
    </div>
  )
}

export default Banner;
