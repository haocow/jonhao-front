import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';

const getChildren = (tabs) => {
  return tabs.map(({id, label}) => {
    return (
      <Tab
        key={id}
        label={label}
      />
    );
  });
}

const getTabFromPath = (tabs, history) => {
  const path = history.location.pathname;
  const tabIndex = tabs.findIndex(tab => path === tab.path)
  return tabIndex >= 0 ? tabIndex : null;
}

const HeaderTabs = ({ onChange, tabs }) => {
  const history = useHistory();
  const [selectedTabIndex, setSelectedTabIndex] = useState(getTabFromPath(tabs, history));

  const onTabChange = (e, newSelectedTabIndex) => {
    setSelectedTabIndex(newSelectedTabIndex);
    onChange(newSelectedTabIndex);
    history.push(tabs[newSelectedTabIndex].path);
  };

  return (
    <div className='header-tabs'>
      <Tabs
        onChange={onTabChange}
        value={selectedTabIndex}
      >
        {getChildren(tabs)}
      </Tabs>
    </div>
  );
}

HeaderTabs.propTypes = {
  onChange: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })),
}

HeaderTabs.defaultProps = {
  onChange: () => {},
}

export default HeaderTabs;
