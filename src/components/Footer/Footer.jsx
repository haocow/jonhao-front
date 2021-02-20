import classnames from "classnames";

import './Footer.scss';

const Footer = () => {
  const classNames = classnames('footer');

  return (
    <div className={classNames}>
      I AM TECHNICALLY A FOOTER!
    </div>
  );
}

export default Footer;
