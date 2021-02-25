export const getCurrency = (str) => {
  return Number(renderCurrency(str));
}

export const renderCurrency = (val) => {
  if (isNaN(val)) {
    return renderCurrency(0);
  }
  return Number(val).toFixed(2);
}
