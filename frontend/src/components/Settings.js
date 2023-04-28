// components/Settings.js

import React from "react";

const Settings = ({ settings }) => {
  return (
    <div>
      <h3>Settings</h3>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
};

export default Settings;
