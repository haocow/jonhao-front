import React from 'react';
import { Checkbox } from '@material-ui/core';

const PlatesesRowCheckbox = ({ checked, onChange }) => {
  return (
    <Checkbox
      checked={checked}
      color='default'
      onChange={() => onChange(!checked)}
    />
  );
}

PlatesesRowCheckbox.defaultProps = {
  checked: false,
  onChange: () => {},
}

export default PlatesesRowCheckbox;
