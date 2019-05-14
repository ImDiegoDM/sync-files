import * as React from 'react';
import { Synchronizer } from '../../Synchronizer';
import { HeaderOptions } from '../components/HeaderOptions';

export function SelectedFolderPage(){
  return <>
    <HeaderOptions />
    <Synchronizer/>
  </>
}