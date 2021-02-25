import { getCurrency, renderCurrency } from '../currency';

test('renders currency amount string to decimal string', () => {
  expect(renderCurrency('1.23')).toEqual('1.23');
});

test('renders currency amount to decimal string', () => {
  expect(renderCurrency(1.23)).toEqual('1.23');
});

test('get currency amount from decimal', () => {
  expect(getCurrency(1.23)).toEqual(1.23);
});

test('get currency amount from decimal string', () => {
  expect(getCurrency('1.23')).toEqual(1.23);
});

test('get currency amount for 0', () => {
  expect(getCurrency(0)).toEqual(0.00);
});
