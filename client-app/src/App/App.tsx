import * as React from 'react';
import * as logo from './images/logo.svg';
import { Synchronizer } from '../Synchronizer';
import { getFolderUrl, saveFolderUrl } from '../folder';
import { ChossenDirectory } from '../ChossenDirectory';
import { GlobalStyle } from './components/GlobalStyle';
import { SelectedFolderPage } from './pages/SelectedFolderPage';

const App: React.FC = () => {
  console.log(logo);

  return (
    <>
      <h1>Simple sync file sistem</h1>
      <GlobalStyle/>
      <Root/>
    </>
  );
}

function Root(){
  const [folder,setFolder] = React.useState(getFolderUrl());

  if(folder === undefined || folder === null){
    return <ChossenDirectory onChange={(event)=>{
      const path = event.target.files[0].path;
      setFolder(path);
      saveFolderUrl(path);
    }}/>
  }

  return <SelectedFolderPage/>
}

export default App;
