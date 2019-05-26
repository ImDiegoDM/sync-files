import * as React from 'react';
import styled from 'styled-components';

interface ChossenDirectoryProps{
  onChange:(event: React.ChangeEvent<HTMLInputElement>)=>void
}

const LabelButton = styled.label`
  padding: 5px;
  background-color: #dadada;
  border-radius: 5px;
  border: 1px solid #b9b9b9;

  &:hover{
    background-color: #d2d2d2;
    cursor: pointer;
  }
`;

export function ChossenDirectory(props:ChossenDirectoryProps){
  
  return <LabelButton>
    Please select a folder...
    <input type="file" onChange={props.onChange} webkitdirectory="true" />
  </LabelButton>
}