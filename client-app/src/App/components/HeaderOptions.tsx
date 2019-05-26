import * as React from 'react';
import { Box } from '../../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderMinus } from '@fortawesome/free-solid-svg-icons';
import { getFolderUrl, clearFolder } from '../../folder';
import { Subscribe } from '../../events';

const id='header';

export function HeaderOptions(){
  const [path,setPath] = React.useState(getFolderUrl());

  return <Box width="100%" justifyContent="space-between" padding="0 20px">
    <p>{path}</p>
    <button title="remove folder from sync" onClick={clearFolder}>
      <FontAwesomeIcon icon={faFolderMinus} size="2x"/>
    </button>
  </Box>
}