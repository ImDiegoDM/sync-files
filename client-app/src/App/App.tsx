import * as React from 'react';
import * as logo from './images/logo.svg';
import { Synchronizer } from '../Synchronizer';

const App: React.FC = () => {
  console.log(logo);
  return (
    <>
      <h1>Work</h1>
      <Synchronizer/>
    </>
  );
}

export default App;
