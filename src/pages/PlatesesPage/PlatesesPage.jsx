import React, { useState } from 'react';
import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';

import PlatesesTableRow from './subcomponents/PlatesesTableRow';

import './PlatesesPage.scss';

const ENTER_KEY_CODE = 13;

const PlatesesPage = () => {
  const [diners, setDiners] = useState([]);
  const [dinerText, setDinerText] = useState('');
  const [dinerTextError, setDinerTextError] = useState(false);
  const [dinerTextErrorMsg, setDinerTextErrorMsg] = useState('');
  const [items, setItems] = useState([{amount: '', checked: false, id: 0, name: '', selected: new Set()}]);

  // ON CHANGE FUNCTIONS
  const onDinerNameChange = (e) => {
    setDinerTextError(false);
    setDinerTextErrorMsg('');
    setDinerText(e.target.value);
  }

  const onDelete = (chipToDelete) => {
    items.forEach((item) => item.selected.delete(chipToDelete.name)); // remove name from all selecteds
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

  const getHeader = () => {
    return (
      <TableHead>
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

  const getBody = () => {
    return (
      <TableBody>
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
          />)
        }
      </TableBody>
    );
  }

  const getTable = () => {
    return (
      <TableContainer>
        <Table className='plateses-table'>
          {getHeader()}
          {getBody()}
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
