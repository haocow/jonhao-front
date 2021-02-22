import React, { useState } from 'react';
import { Chip, TextField } from '@material-ui/core';

import './PlatesesPage.scss';

const ENTER_KEY_CODE = 13;

const PlatesesPage = () => {
  const [diners, setDiners] = useState([]);
  const [dinerText, setDinerText] = useState('');
  const [dinerTextError, setDinerTextError] = useState(false);
  const [dinerTextErrorMsg, setDinerTextErrorMsg] = useState('');

  const onChange = (e) => {
    setDinerTextError(false);
    setDinerTextErrorMsg('');
    setDinerText(e.target.value);
  }

  const onDelete = (chipToDelete) => {
    setDiners(diners.filter((diner) => diner.name !== chipToDelete.name ));
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

  const isNewDiner = (name) => {
    return diners.findIndex((diner) => name === diner.name) === -1;
  }

  return (
    <div className='application plateses'>
      <div className='plateses-inputs'>
        <div className='plateses-inputs__diners'>
          <TextField
            error={dinerTextError}
            helperText={dinerTextErrorMsg}
            onChange={(e) => onChange(e) }
            onKeyDown={(e) => onKeyDown(e)}
            placeholder='Diner name...'
            value={dinerText}
          />
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
      <div className='plateses-content'>

      </div>
    </div>
  );
}

export default PlatesesPage;
