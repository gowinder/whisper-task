import { ListItemIcon, MenuList, Paper } from '@mui/material';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Menu() {
  return (
    <Paper>
      <MenuList>
        <ListItemIcon>
          <SettingsIcon></SettingsIcon>
        </ListItemIcon>
      </MenuList>
    </Paper>
  );
}
