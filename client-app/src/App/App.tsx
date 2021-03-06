import * as React from 'react';
import * as logo from './images/logo.svg';
import { Synchronizer } from '../Synchronizer';
import { getFolderUrl, saveFolderUrl, folderChannel, FolderActions } from '../folder';
import { ChossenDirectory } from '../ChossenDirectory';
import { GlobalStyle } from './components/GlobalStyle';
import { SelectedFolderPage } from './pages/SelectedFolderPage';
import { Subscribe, UnSubscribe } from '../events';
import { remote } from 'electron';
import { Logs } from '../Logs';

const fs:any = remote.require('fs');
const path:any = remote.require('path');

const App: React.FC = () => {
  console.log(logo);
  return (
    <>
      <h1>Simple sync file sistem</h1>
      <GlobalStyle/>
      <Logs/>
      <Root/>
    </>
  );
}

const ID = 'root';

function Root(){
  const [folder,setFolder] = React.useState(getFolderUrl());

  
  React.useEffect(()=>{

    Subscribe(folderChannel,ID,(message,payload)=>{
      switch (message) {
        case FolderActions.clearFolder:
          setFolder(undefined);
          break;
        case FolderActions.setFolder:
          setFolder(payload)
          break;
      }
    });

    return ()=>{
      UnSubscribe(folderChannel,ID);
    }
  },[])

  if(folder === undefined || folder === null){
    return <ChossenDirectory onChange={(event)=>{
      const chosenPath = event.target.files[0].path;
      const folder = path.join(chosenPath,'sync');
      if(!fs.existsSync(folder)){
        fs.mkdirSync(folder);
      }
      setFolder(folder);
      saveFolderUrl(folder);
    }}/>
  }

  return <SelectedFolderPage/>
}

export default App;
