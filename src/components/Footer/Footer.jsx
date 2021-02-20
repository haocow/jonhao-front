import classnames from "classnames";

import './Footer.scss';

const Footer = () => {
  const classNames = classnames('footer');

  return (
    <div className={classNames}>
      <div className='footer__left'>What do you think?</div>
      <div className='footer__right'>Made by Jon & Joey</div>
    </div>
  );
}

export default Footer;
