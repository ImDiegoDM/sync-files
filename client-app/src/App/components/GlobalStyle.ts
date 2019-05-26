import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  button{
    background-color: transparent;
    padding: 0;
    margin: 0;
    border: none;
    cursor: pointer;
    color: gray;
  }

  button:hover{
    color: #6f6f6f;
  }

  input[type="file" i]{
    display:none;
  }
`;