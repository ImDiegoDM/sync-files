import * as React from 'react';
import styled from 'styled-components';
import { Box } from '../../Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../../Common/Icon';

const Container = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 0 8px 0px #b5b5b5;
  margin: 20px;
`;

const FileName = styled.p`
  margin: 0;
  text-overflow: ellipsis;
  width:80%;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
`;

interface FileProps{
  name:string;
}

export function File(props:FileProps){
  const size="150px";

  return <Container width={size} 
    direction="column" 
    height={size} 
    justifyContent="center" 
    alignItems="center"
  >
    <Icon>
      <FontAwesomeIcon icon={faFileAlt} size="2x"/>
    </Icon>
    <FileName>{props.name}</FileName>
  </Container>
}