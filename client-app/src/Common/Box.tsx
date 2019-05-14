import styled from 'styled-components';

interface BoxProps{
  direction?: 'row'|'row-reverse'|'column'|'column-reverse'|'initial'|'inherit';
  width?: string;
  height?: string;
  wrap?: 'nowrap'|'wrap'|'wrap-reverse'|'initial'|'inherit';
  justifyContent?: 'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'initial'|'inherit';
  alignItems?: 'stretch'|'center'|'flex-start'|'flex-end'|'baseline'|'initial'|'inherit';
  alignContent?: 'stretch'|'center'|'flex-start'|'flex-end'|'space-between'|'space-around'|'initial'|'inherit';
  margin?:string;
  padding?:string;
}

export const Box = styled.div<BoxProps>`
  display: flex;
  box-sizing: border-box;
  ${props => props.direction ? `flex-direction: ${props.direction}`:''}
  ${props => props.width ? `width: ${props.width}`:''}
  ${props => props.height ? `height: ${props.height}`:''}
  ${props => props.wrap ? `flex-wrap: ${props.wrap}`:''}
  ${props => props.justifyContent ? `justify-content: ${props.justifyContent}`:''}
  ${props => props.alignItems ? `align-items: ${props.alignItems}`:''}
  ${props => props.alignContent ? `align-content: ${props.alignContent}`:''}
  ${props => props.margin ? `margin: ${props.margin}`:''}
  ${props => props.padding ? `padding: ${props.padding}`:''}
`;