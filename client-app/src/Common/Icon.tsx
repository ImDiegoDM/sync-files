import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IconProps{
  color?:string;
}

export const Icon = styled.div<IconProps>`
  color: ${props=> props.color ? props.color:'#8c8c8c'};
  padding-bottom: 10px;
`;