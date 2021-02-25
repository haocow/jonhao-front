import React, { useState } from 'react';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import { getCurrency, renderCurrency } from '../../utils/currency';
import {renderPercentage, toDecimal} from '../../utils/percentages';
import { getUpdatedShares } from './subcomponents/PlatesesTableRow';

import PlatesesTableRow from './subcomponents/PlatesesTableRow';
import TaxInput from '../../components/TaxInput/TaxInput';

import { DECIMAL, DEFAULT_TIP_PCT, ENTER_KEY_CODE, PERCENTAGE, TAX_RATE_NY } from '../../constants';

import './PlatesesPage.scss';

const DEFAULT_TAX = toDecimal(TAX_RATE_NY);
const DEFAULT_TIP = toDecimal(DEFAULT_TIP_PCT);

const PlatesesPage = () => {
  const [diners, setDiners] = useState([{name: 'You'}]);
  const [dinerText, setDinerText] = useState('');
  const [dinerTextError, setDinerTextError] = useState(false);
  const [dinerTextErrorMsg, setDinerTextErrorMsg] = useState('');
  const [items, setItems] = useState([{amount: '', checked: false, id: 0, name: '', selected: new Set(), shares: {first: 0.00, rest: 0.00}}]);
  const [tax, setTax] = useState(DEFAULT_TAX);
  const [taxError, setTaxError] = useState(false);
  const [taxType, setTaxType] = useState(PERCENTAGE);
  const [tips, setTips] = useState(DEFAULT_TIP);
  const [tipsError, setTipsError] = useState(false);
  const [tipsType, setTipsType] = useState(PERCENTAGE);

  // ON CHANGE FUNCTIONS
  const onDinerNameChange = (e) => {
    setDinerTextError(false);
    setDinerTextErrorMsg('');
    setDinerText(e.target.value);
  }

  const onDelete = (chipToDelete) => {
    const newItems = items.map(item => {
      const name = chipToDelete.name;
      const updates = {};
      if (item.selected.has(name)) {
        const newSelected = new Set(item.selected)
        newSelected.delete(name)
        updates.selected = newSelected
        updates.shares = getUpdatedShares(item.amount, newSelected);
      }
      return {...item, ...updates};
    });
    setItems(newItems); // remove name from all selecteds and update shares
    setDiners(diners.filter((diner) => diner.name !== chipToDelete.name )); // remove name from diners list
  }

  const onKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY_CODE) {
      if (dinerText && isNewDiner(dinerText)) {
        setDiners(diners.concat({name: dinerText}));
        setDinerText('');
      } else {
        setDinerTextError(true);

        if (!dinerText) {
          setDinerTextErrorMsg('Name must not be empty');
        } else if (!isNewDiner(dinerText)) {
          setDinerTextErrorMsg('Name already exists');
        } else {
          setDinerTextErrorMsg('Unknown error');
        }
      }
    }
  }

  const onTaxChange = (val) => {
    const isPercentage = val.slice(-1) === '%';
    const tax = val === '' ? DEFAULT_TAX : val;
    const type = (val === '' || isPercentage) ? PERCENTAGE : DECIMAL;

    setTax(toDecimal(tax));
    setTaxError(isNaN(toDecimal(tax)));
    setTaxType(type);
  }

  const onTipsChange = (val) => {
    const isPercentage = val.slice(-1) === '%';
    const tip = val === '' ? DEFAULT_TIP : val;
    const type = (val === '' || isPercentage) ? PERCENTAGE : DECIMAL;

    setTips(toDecimal(tip));
    setTipsError(isNaN(toDecimal(tip)));
    setTipsType(type);
  }

  const getHeader = () => {
    return (
      <TableHead id='table-header'>
        <TableRow>
          <TableCell className='item-name-header item-name-col' scope='col'>Item</TableCell>
          <TableCell className='currency-symbol amount-col' scope='col'>$</TableCell>
          {diners.map(diner =>
            <TableCell key={diner.name}>{diner.name}</TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  }

  const getItemsBody = () => {
    return (
      <TableBody id='items-body'>
        {items.map((item) =>
          <PlatesesTableRow
            amount={item.amount}
            checked={item.checked}
            diners={diners}
            id={item.id}
            items={items}
            key={item.id}
            name={item.name}
            onChange={setItems}
            selected={item.selected}
            shares={item.shares}
          />)
        }
      </TableBody>
    );
  }

  const getTotalsBody = () => {
    return (
      <TableBody id='totals-body'>
        {getSubtotalsRow()}
        {getTaxesRow()}
        {getTipsRow()}
        {getTotalsRow()}
      </TableBody>
    );
  }

  const getSubtotalsRow = () => {
    const dinerSubtotals = getDinerSubtotalsMap();

    return (
      <TableRow className='subtotals-row'>
        <TableCell className='subtotals-row name-col'>Subtotal</TableCell>
        <TableCell className='subtotals-row amount-col'>{renderCurrency(getSubtotalAmount())}</TableCell>
        {diners.map((diner) =>
          <TableCell
            className='subtotals-row diner-subtotal'
            key={diner.name}
          >
            {renderCurrency(dinerSubtotals[diner.name])}
          </TableCell>
        )}
      </TableRow>
    )
  }

  const getTaxesRow = () => {
    const dinerTaxes = getDinerAdditionalsMap(taxType, tax);

    return (
      <TableRow className='taxes-row'>
        <TableCell className='taxes-row name-col'>+ Taxes</TableCell>
        <TableCell className='taxes-row amount-col'>
          <TaxInput
            error={taxError}
            onChange={val => onTaxChange(val)}
            placeholder={DEFAULT_TAX}
          />
        </TableCell>
        {diners.map((diner) =>
          <TableCell
            className='taxes-row diner-tax'
            key={diner.name}
          >
            {renderCurrency(dinerTaxes[diner.name])}
          </TableCell>
        )}
      </TableRow>
    );
  }

  const getDinerAdditionalsMap = (type, amount) => {
    const subtotal = getSubtotalAmount();
    const dinerSubtotals = getDinerSubtotalsMap();
    const dinerShares = {}

    let subtotalDiff = type === DECIMAL ? amount : subtotal*amount;
    diners.forEach(diner => {
      if (type === PERCENTAGE) {
        const amt = getCurrency(dinerSubtotals[diner.name] * amount);
        dinerShares[diner.name] = isNaN(amt) ? getCurrency(0) : amt;
        subtotalDiff -= amt;
      } else {
        const share = toDecimal(dinerSubtotals[diner.name]/subtotal);
        subtotalDiff -= getCurrency(amount * share);
        dinerShares[diner.name] = getCurrency(amount * share);
      }
    })

    const first = diners.find(diner => dinerSubtotals[diner.name] > 0);
    if (first) {
      dinerShares[first.name] += getCurrency(subtotalDiff);
    }

    return dinerShares;
  }

  const getTipsRow = () => {
    const dinerTips = getDinerAdditionalsMap(tipsType, tips);

    return (
      <TableRow className='tips-row'>
        <TableCell className='tips-row name-col'>+ Tips</TableCell>
        <TableCell className='tips-row amount-col'>
          <TaxInput
            error={tipsError}
            onChange={val => onTipsChange(val)}
            placeholder={DEFAULT_TIP}
          />
        </TableCell>
        {diners.map((diner) =>
          <TableCell
            className='tips-row diner-tip'
            key={diner.name}
          >
            {renderCurrency(dinerTips[diner.name])}
          </TableCell>
        )}
      </TableRow>
    );
  }

  const getTotalAmount = () => {
    const subtotal = getSubtotalAmount();
    const taxAmt = taxType === DECIMAL ? tax : subtotal*tax;
    const tipAmt = tipsType === DECIMAL ? tips : subtotal*tips;

    return subtotal + taxAmt + tipAmt;
  }

  const getTotalsRow = () => {
    const total = getTotalAmount();
    const dinerSubtotals = getDinerSubtotalsMap();
    const dinerTaxes = getDinerAdditionalsMap(taxType, tax);
    const dinerTips = getDinerAdditionalsMap(tipsType, tips);

    return (
      <TableRow className='totals-row'>
        <TableCell className='totals-row name-col'>Grand Total</TableCell>
        <TableCell className='totals-row amount-col'>{renderCurrency(total)}</TableCell>
        {diners.map(diner =>
          <TableCell
            className='totals-row diner-total'
          >
            {renderCurrency(dinerSubtotals[diner.name] + dinerTaxes[diner.name] + dinerTips[diner.name])}
          </TableCell>
        )}
      </TableRow>
    );
  }

  const getSubtotalAmount = () => {
    return items.reduce((acc, item) => acc + getCurrency(item.amount), 0.00);
  }

  const getDinerSubtotalsMap = () => {
    const dinerSubtotals = {}
    diners.forEach(diner => dinerSubtotals[diner.name] = 0.00);
    items.forEach(item => {
      const first = diners.find(diner => item.selected.has(diner.name));
      item.selected.forEach(name =>
        dinerSubtotals[name] += name === first.name ? item.shares.first : item.shares.rest
      );
    });
    return dinerSubtotals;
  }

  const getTable = () => {
    return (
      <TableContainer>
        <Table id='plateses-table'>
          {getHeader()}
          {getItemsBody()}
          {getTotalsBody()}
        </Table>
      </TableContainer>
    );
  }

  const getDinersBar = () => {
    return (
      <div className='plateses-inputs__diners'>
        <TextField
          error={dinerTextError}
          helperText={dinerTextErrorMsg}
          onChange={(e) => onDinerNameChange(e) }
          onKeyDown={(e) => onKeyDown(e)}
          placeholder='Diner name...'
          value={dinerText}
        />
        <div className='plateses-inputs-diner-chips'>
          {diners.map((chip) => {
            return (
              <Chip
                id={chip.name}
                key={chip.name}
                label={chip.name}
                name={chip.name}
                onDelete={() => onDelete(chip)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const isNewDiner = (name) => {
    return diners.findIndex((diner) => name === diner.name) === -1;
  }

  return (
    <div className='application plateses'>
      <div className='plateses-inputs'>
        {getDinersBar()}
      </div>
      <div className='plateses-content'>
        <h3>Itemized Items</h3>
        {getTable()}
      </div>
    </div>
  );
}

export default PlatesesPage;
