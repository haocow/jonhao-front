import React, { useState } from 'react';
import classnames from 'classnames';
import { TableCell, TableRow, TextField } from '@material-ui/core';
import { getCurrency, renderCurrency } from '../../../utils/currency';

import PlatesesRowCheckbox from './PlatesesRowCheckbox';

export const getUpdatedShares = (amount, selected) => {
  return {
    first: calculateFirstShare(amount, selected) || 0.00,
    rest: calculateBaseShare(amount, selected) || 0.00,
  };
}

export const calculateBaseShare = (amount, selected) => {
  if (selected.size === 0 || isNaN(Number(amount/selected.size))) {
    return getCurrency(0);
  }

  return getCurrency(amount/selected.size);
}

export const calculateFirstShare = (amount, selected) => {
  const baseShare = calculateBaseShare(amount, selected);
  return getCurrency(baseShare + (amount - (baseShare * selected.size)));
}

const PlatesesTableRow = ({ amount, checked, diners, id, items, name, onChange, selected, shares }) => {
  const [amountError, setAmountError] = useState(false);

  const onRowAmountChange = (id, amount) => {
    setAmountError(isNaN(getCurrency(amount)));
    const shares = getUpdatedShares(amount, selected);
    const updatedItems = getUpdatedItems({ id, amount, shares })
    onChange(updatedItems);
  };

  const onRowNameChange = (id, name) => {
    const updatedItems = getUpdatedItems({ id, name })

    if (id !== items.length-1) {
      onChange(updatedItems);
    } else {
      onChange(updatedItems.concat(getNewItem(id+1)));
    }
  };

  const onDinerCellClick = (id, diner) => {
    const newSet = new Set(selected);
    let updates = {};

    if (!selected.has(diner.name)) {
      newSet.add(diner.name);
      if (newSet.size === diners.length) {
        updates.checked = true;
      }
    } else {
      newSet.delete(diner.name);
      updates.checked = false;
    }
    updates.selected = newSet;
    updates.shares = getUpdatedShares(amount, newSet);
    onChange(getUpdatedItems({ id, ...updates }))
  }

  const onCheckboxClick = (id, checked) => {
    let updates = {checked: checked};;
    if (checked) {
      updates.selected = new Set(diners.map((diner) => diner.name));
    } else {
      updates.selected = new Set();
    }
    updates.shares = getUpdatedShares(amount, updates.selected);
    onChange(getUpdatedItems({ id, ...updates }))
  }

  const getNewItem = (id) => {
    return { amount: '', checked: false, id, name: '', selected: new Set(), shares: {first: 0.00, rest: 0.00} };
  }

  const getUpdatedItems = ({id, ...updates}) => {
    const updatedRow = {...items[id], ...updates};
    return items.map(item => item.id === id ? updatedRow : item);
  }

  const getFirstSelectedDiner = () => {
    return diners.find(diner => selected.has(diner.name));
  }

  return (
    <TableRow
      id={id}
      key={id}
    >
      <TableCell className='input item-name-col'>
        <TextField
          margin='none'
          onChange={val => onRowNameChange(id, val.target.value)}
          placeholder='Description'
          value={name}
          variant='outlined'
        />
      </TableCell>
      <TableCell className='input amount-col'>
        <TextField
          disabled={!name}
          error={amountError}
          margin='none'
          onChange={val => onRowAmountChange(id, val.target.value)}
          variant='outlined'
          value={amount}
        />
      </TableCell>
      {diners.map((diner) => {
        const first = getFirstSelectedDiner();
        const share = selected.has(diner.name) ?
          (diner.name === first.name ? shares.first : shares.rest) :
          0;

        const classNames = classnames(
          'itemized-item',
          {
            'selected': selected.has(diner.name),
          });
        return (
          <TableCell
            className={classNames}
            key={diner.name}
            onClick={() => onDinerCellClick(id, diner)}
            style={{
              border: `1px solid`,
            }}
          >
            {renderCurrency(share)}
          </TableCell>
        );
      })}
      <TableCell className='input' padding='checkbox' size='small'>
        <PlatesesRowCheckbox
          checked={checked}
          onChange={(checked) => onCheckboxClick(id, checked)}
        />
      </TableCell>
    </TableRow>
  );
}

PlatesesTableRow.defaultProps = {
  onChange: () => {},
}

export default PlatesesTableRow;
