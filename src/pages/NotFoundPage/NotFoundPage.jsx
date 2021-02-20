import React from 'react';
import classnames from 'classnames';

import './NotFoundPage.scss';

const NotFoundPage = () => {
  const classNames = classnames('not-found')

  return (
    <div className={classNames}>
      <div className='not-found__item not-found--status'>404</div>
      <div className='not-found__item not-found--status-desc'>NOT FOUND</div>
      <div className='not-found__item not-found--message'>Perhaps you typed in the URL wrong?</div>
    </div>
  );
}

export default NotFoundPage;
