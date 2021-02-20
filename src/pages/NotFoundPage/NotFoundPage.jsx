import React from 'react';
import classnames from 'classnames';

import './NotFoundPage.scss';

const NotFoundPage = () => {
  const classNames = classnames('not-found')

  return (
    <div className={classNames}>
      <div className='not-found--main'>404 NOT FOUND</div>
      <div className='not-found--secondary'>Try reloading the page?</div>
    </div>
  );
}

export default NotFoundPage;
