import React from 'react';
import { TextField } from "@material-ui/core";
import { renderPercentage, toDecimal } from '../../utils/percentages';

import { TAX_RATE_NY } from '../../constants';

const TaxInput = ({ error, onChange, placeholder, variant }) => {
  const handleChange = (val) => {
    onChange(val);
  }

  return (
    <TextField
      error={error}
      margin='none'
      onChange={val => handleChange(val.target.value)}
      placeholder={renderPercentage(placeholder)}
      variant={variant}
    />
  );
}

TaxInput.defaultProps = {
  error: false,
  onChange: () => {},
  placeholder: toDecimal(TAX_RATE_NY),
  variant: 'outlined',
}

export default TaxInput;
