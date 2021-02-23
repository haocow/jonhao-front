import React from 'react';
import classnames from 'classnames';
import { TableCell, TableRow, TextField } from '@material-ui/core';

import PlatesesRowCheckbox from './PlatesesRowCheckbox';

const PlatesesTableRow = ({ amount, checked, diners, id, items, name, onChange, selected }) => {
  const onRowAmountChange = (id, amount) => {
    const updatedItems = getUpdatedItems({ id, amount })
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

    if (selected.has(diner.name)) {
      newSet.delete(diner.name);
      updates.checked = false;
    } else {
      newSet.add(diner.name);
    }
    updates.selected = newSet;
    onChange(getUpdatedItems({ id, ...updates }))
  }

  const onCheckboxClick = (id, checked) => {
    let updates = {checked: checked};
    if (checked) {
      updates.selected = new Set(diners.map((diner) => diner.name));
    } else {
      updates.selected = new Set();
    }
    onChange(getUpdatedItems({ id, ...updates }))
  }

  const getDisplayAmount = (diner, amount, selected) => {
    if (!amount || selected.size === 0 || !selected.has(diner.name)) {
      return Number(0).toFixed(2);
    }

    let share = Number(Number(amount/selected.size).toFixed(2));
    if (diner === getFirstSelectedDiner()) {
      share += (amount - (share * selected.size));
    }

    return share.toFixed(2);
  }

  const getNewItem = (id) => {
    return { amount: '', checked: false, id, name: '', selected: new Set() };
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
          onChange={(val) => onRowNameChange(id, val.target.value)}
          placeholder='Description'
          value={name}
          variant='outlined'
        />
      </TableCell>
      <TableCell className='input amount-col'>
        <TextField
          disabled={!name}
          margin='none'
          onChange={(val) => onRowAmountChange(id, val.target.value)}
          variant='outlined'
          value={amount}
        />
      </TableCell>
      {diners.map((diner) => {
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
            {getDisplayAmount(diner, amount, selected)}
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
