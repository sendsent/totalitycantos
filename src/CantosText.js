import "./App.css";
import React, { useEffect, useContext, useState, useRef } from "react";
import { DispatchContext, StateContext } from "./context/cantosReducer";
import { Context } from "./context/ContextState";


function CantosText() {
  const { text, index } = useContext(Context);
  const state = useContext(StateContext);
  const { cantosText, cantosIndex, cantoStore } = state;
  const dispatch = useContext(DispatchContext);
  const [cantos, setCantos] = useState();
  const [input, setInput] = useState(0);
  const [isClear, setIsClear] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef(null);
 

//   const alertMsg = (type) => { 
//     switch (type) {
//       case 'low': {
//      return window.alert('Please enter a number larger than 0.')
//       }   
//       case 'high': {
//         return window.alert('The maximum amount is 1000. Please enter a number between 1 and 1000.')
//       }
//       default: {
//         return window.alert('There was an error.  Please reset and try again')
//       }
//   }
// }
  // const onClear = () => {
  //   setInput(0);
  //   setDisplayText("");
  //   setIsClear(true);
  //   setIsSubmitted(false);
  // };

  const onClear = () => {
    setInput("");
    setDisplayText("");
    setIsClear(true);
    setIsSubmitted(false);
  };

  const alertMsg = (type) => { 
    switch (type) {
      case 'low': {
        onClear()
     return window.alert('Please enter a number larger than 0.')
      }   
      case 'high': {
         onClear()
        return window.alert('The maximum amount is 1000. Please enter a number between 1 and 1000.')
      }
      default: {
        onClear()
        return window.alert('There was an error.  Please reset and try again')
      }
  }
}
 
  const preventMinus = (e) => {
    if (e.code === 'Minus' || e.target.value === 0) {
        e.preventDefault();
    }
};
const preventPasteNegative = (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedData = parseFloat(clipboardData.getData('text'));

  if (pastedData < 0 || pastedData > 1000) {
      e.preventDefault();
  }
};

  const onChange = (e) => {
   
    setInput(e.target.value ? Number(e.target.value) : e.target.value);
    setIsClear(false);
  };

  // const onChange = (e) => {
  //   setInput(e.target.value);
  //   setIsClear(false);
  // };
 
  const onClick = () => {
    setIsSubmitted(true);
    if (input <= 0) {
      
      setTimeout(alertMsg('low'), 200)
    }
    if (input > 1000) {
      setTimeout(alertMsg('high'), 200)
    }
    if (input > 0 && input <= 1000){ 
    
    dispatch({ type: "cantos_text", payload: { text: text, input: input } });
    
  };
}

  useEffect(() => {
    if (isClear) {
      inputRef.current.focus();
    }
  }, [isClear]);

  useEffect(() => {
    if (cantoStore && input > 0) {
      setDisplayText(cantoStore.output);
    }
  }, [cantoStore]);

  return (
    <div className="App">
          <table className="center">

    <div className="textstuff">
    <tr>
    <td colspan={2}>
    <img src="https://images-na.ssl-images-amazon.com/images/I/41S5Q3AE70L.jpg"/>
    <i>The Totality Cantos</i><br/>
    Brian Ang<br/>
    Atelos, 2021<br/>
    <br/>
    <a href="">pdf</a> <a href="">print</a><br/>
    <br/>
    The 2008 economic crisis and global backdrop of struggles by 2011 renewed possibilities for thinking totality, materializing it for apprehension. I wrote <i>The Totality Cantos</i> from the desire to be interested in everything, sampling from discourses of history, philosophy, religion, science, and the humanities, knowledges of what constitute totality. Assemblage poetics, constructive verse, writing adequate to apprehending totality.<br/>
    <br/>
    <i>The Totality Cantos</i> is Brian Ang’s first book. totalitycantos@gmail.com<br/>
    <br/>
    <i>The Totality Cantos</i> generator randomizes assemblages of the poem’s one thousand sections. Programming by Alif Aleph Sajan & Franz Fernando.<br/>
  </td>
</tr>
</div>
<tr>
    <td colspan={2}>
    <p>
    
    <p class="textstuff">Generate random number of sections in range (1-1000)</p>
    <button id="submit" disabled={isSubmitted} onClick={() => onClick()}>
            generate{" "}
          </button>
          <button id="clear" disabled={!isSubmitted} onClick={() => onClear()}>
            reset
          </button>

          <input
            placeholder="0"
            ref={inputRef}
            type="number"
            id="number"
            min="1"
            step="1"
            value={input && Math.max(0, input)}
            onChange={(e) => onChange(e)}
            disabled={isSubmitted}
            onKeyPress={(e) => preventMinus(e)}
            onPaste={(e) => preventPasteNegative(e)}
          />

  </p>
    </td>
    </tr>
    </table>
      
      <div class="col-md-4" style={{ marginLeft: "14.5rem" }}>
        {displayText && (
          <textarea
            style={{ paddingLeft: 70, paddingTop: 20 }}
            id="textinput"
            rows="13"
            cols="120"
            value={displayText}
          ></textarea>
        )}
      </div>
    </div>
  );
}

export default CantosText;
