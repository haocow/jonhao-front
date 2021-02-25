import { renderPercentage, toDecimal, toPercentageStr } from '../percentages';

test('converts strings to decimals', () => {
  expect(toDecimal('1.23')).toEqual(1.23);
  expect(toDecimal('1.23%')).toEqual(.0123);
});

test('passes decimals through', () => {
  expect(toDecimal(1.23)).toEqual(1.23);
});

test('checks toDecimal for invalid input', () => {
  expect(toDecimal('1.23f')).toEqual(NaN);
  expect(toDecimal('1.23%%')).toEqual(NaN);
});

test('converts strings to percentage strings', () => {
  expect(toPercentageStr('.0123')).toEqual('1.23%');
  expect(toPercentageStr('1.23%')).toEqual('1.23%');
});

test('checks toPercentageStr for invalid input', () => {
  expect(toPercentageStr('1.23f')).toEqual('NaN%');
});

test('checks renderPercentage for invalid input', () => {
  expect(renderPercentage('1.23')).toEqual('123.00%');
  expect(renderPercentage('0.45')).toEqual('45.00%');
  expect(renderPercentage('.45')).toEqual('45.00%');
  expect(renderPercentage('45%')).toEqual('45.00%');
  expect(renderPercentage('45.6%')).toEqual('45.60%');
});

test('checks toPercentageStr for invalid input', () => {
  expect(renderPercentage('1.23f')).toEqual('NaN%');
});