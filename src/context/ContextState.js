import React,  { useReducer, useEffect, useMemo, useState, useContext, createContext } from 'react';
import { cantosReducer } from './cantosReducer';
import App from '../CantosText'
import textFile from  '../assets/cantos.txt'
import formatCantos from "./cantoIndex"

export const Context = createContext()

const ContextState = ({children}) => {
    const [randomCantos, setRandomCantos] = useState()
    const [index, setIndex] = useState()
    const [text, setText] = useState();

    // useMemo(() => {
    //   fetch(textFile)
    //     .then((response) => response.text())
    //     .then((textContent) => {
    //       let formattedCantos = formatCantos(textContent)
    //       setText(textContent);
    //       setIndex(formattedCantos.cantoIndex)
    //       // setRandomCantos(formattedCantos.shuffledCantos)
          
    //     })
    // }, [textFile]);

    useEffect(() => {
      fetch(textFile)
        .then((response) => response.text())
        .then((textContent) => {
          let formattedCantos = formatCantos(textContent)
          setText(textContent);
          setIndex(formattedCantos.cantoIndex)
        })
    }, []);
  
    return  (
        <Context.Provider value={{text, index}}>
            {children}
        </Context.Provider>
    )
  }

  export default ContextState
  

   


