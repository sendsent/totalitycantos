function formatCantos(text, size) {
  function shuffle(array) {
    var i = array.length,
      j = 0,
      temp;

    while (i--) {
      j = Math.floor(Math.random() * (i + 1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  const catalog = (size) => {
    let catalogue = [];

    for (let i = 1; i <= 100; i++) {
      for (let j = 1; j <= 10; j++) {
        // let stringValue = `${i}`.toString
        let number = [i, j];
        catalogue = [...catalogue, number];
      }
      shuffle(catalogue);
      // return catalogue
    }
    const resized = catalogue.splice(0, size);
    return size > 0 ? resized : catalogue;
  };

  // This separates the canto numbers into the matches array, and the sections
  // into the tokens array.  Each value will have ten sections in it.
  let delimiter = /.*\w[^\r\n]\d+/gm;
  let tokens = text.split(delimiter);
  let matches = text.match(delimiter);

  // this changes the matches array to only contain the integer value of each canto
  // this will be used to create the indices
  let cantoNumberRegex = /\d+$/g;
  let cantoIndexNumber;
  for (let i = 0; i <= matches.length; i++) {
    if (cantoNumberRegex.test(matches[i])) {
      cantoIndexNumber = matches[i].match(cantoNumberRegex);
      matches[i] = cantoIndexNumber;
    }
  }

  //breaks down an array into chunks of a certain size
  //we use this to create 100 arrays of size 10
  const chunkArray = (arr, size) =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
      : [arr];

  //separate all the canto headings and section numbers and place each canto section into an array
  const sectionNumberRegex = /\[\d.*\]{1,}/gm;
  const sectionDelimiter = /.\d.*\r{1,}/gm;
  const sectionText = tokens.join("");
  let sectionTokens = sectionText.split(sectionNumberRegex);
  const sectionTokenText = sectionTokens.join("");
  sectionTokens.splice(0, 1);

  //creates an array of arrays of the canto sections to be used as the index.

  const resizeCantoIndex = (size) => {
    let allCantos = chunkArray(sectionTokens, 10);
    // let shuffled = shuffle(allCantos)
    let resized = allCantos.splice(0, size);
    return size > 0 && size < 10 ? resized : allCantos;
  };

  let cantoIndex = resizeCantoIndex();
  let shuffledCantos = catalog();
  const getCantoSection = (cantoNumber, cantoSection) => {
    return cantoIndex[cantoNumber - 1][cantoSection - 1];
  };
  const removeFromIndex = (
    obj,
    removeProp,
    path,
    action = "",
    newValue = ""
  ) => {
    const { [removeProp]: remove, ...rest } = obj;
    const removedItem = remove.splice(path, 1)[0];
    // const modified = {...cantoIndex, rest}
    return action === "remove" ? removedItem : rest;
  };

  const removeKeys = (obj, keys) =>
    obj !== Object(obj)
      ? obj
      : Array.isArray(obj)
      ? obj.map((item) => removeKeys(item, keys))
      : Object.fromEntries(
          Object.entries(obj).filter(([k]) => !keys.includes(k))
        );

  //display the canto number and section using the function above
  const displayIndexSection = (cantoNumber, cantoSection) => {
    return (
      `[${cantoNumber}-${cantoSection}]` +
      getCantoSection(cantoNumber, cantoSection)
    );
  };

  //get the first line of a canto section
  const getFirstLine = (cantoNumber, cantoSection) => {
    const firstLinesRegex = /^(\S*)([^\r\n]+)/m;
    return getCantoSection(cantoNumber, cantoSection).match(firstLinesRegex)[0];
  };

  //get the last line of a canto section
  const getLastLine = (cantoNumber, cantoSection) => {
    /* const lastLinesRegex = /(?:.*\n$).*$/m;
      for some reason react will not find the last line using the specified regex, so we calculate that using the split function and choosing the value in the array that has the last line. */
    const canto = getCantoSection(cantoNumber, cantoSection).split("\n");
    // console.log(canto[10]);
    return canto[10];
  };

  //count the margin spaces in a line, callback should either be getFirstLine or getLastLine
  const countMarginSpace = (cantoNumber, cantoSection, callback) => {
    const marginRegex = /^(\s{0,})\b/m;
    let match;
    const textLine = callback(cantoNumber, cantoSection);
    while ((match = marginRegex.exec(textLine)) != null) {
      if (match.index === marginRegex.lastIndex) {
        ++marginRegex.lastIndex;
      }
      // console.log("match", match[0].length)
      return match[0].length;
    }
  };

  //count the margin spaces in a line, callback argument should either be getFirstLine or getLastLine
  const countWords = (cantoNumber, cantoSection, callback) => {
    const textLine = callback(cantoNumber, cantoSection);
    const wordCount = (str) => {
      str = str.replace(/(^\s*)|(\s*$)/gi, "");
      str = str.replace(/[ ]{2,}/gi, " ");
      str = str.replace(/\n /, "\n");
      return str.split(" ").length;
    };
    return wordCount(textLine);
  };

  const reverseObject = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      if (newObj[obj[key]]) {
        newObj[obj[key]].push(key);
      } else {
        newObj[obj[key]] = key;
      }
    });
    return newObj;
  };

  const getWordsAndMargins = (cantoNumber, cantoSection) => {
    let lines = [];
    let counts = {};
    let firstLine = [];
    let lastLine = [];
    let sections = [];
    const firstWords = countWords(cantoNumber, cantoSection, getFirstLine);
    const firstMargins = countMarginSpace(
      cantoNumber,
      cantoSection,
      getFirstLine
    );

    const lastWords = countWords(cantoNumber, cantoSection, getLastLine);
    const lastMargins = countMarginSpace(
      cantoNumber,
      cantoSection,
      getLastLine
    );

    const section = `${cantoNumber}-${cantoSection}`;
    firstLine = [firstWords, firstMargins];
    lastLine = [lastWords, lastMargins];
    lines = { section, firstLine, lastLine };
    let firstLines = {};
    let lastLines = {};
    sections = [`${cantoNumber}-${cantoSection}`];
    const linesMargins = [...firstLine, ...lastLine];
    counts[section] = linesMargins;

    const reversedCount = reverseObject(counts);

    return {
      reversedCount,
      counts,
      sections,
      lines,
      firstLine,
      lastLine,
    };
  };

  //when a conflict is found between a,b send b to the end of the array and
  //continue comparing
  let conflictIndexes = [];
  let secondConflicts = [];
  const findConflicts = (ar) => {
    let i = 0;
    let recheck = false;
   
    if (ar.length <= 1) {
      return ar;
    }
    while (i < ar.length - 1 && ar.length > 1) {
      
      let j = i + 1;
      let previousValue = i > 1 ? ar[i - 1] : ar[0];
      let firstValue = ar[i];
      let secondValue = ar[j];
      let thirdValue = ar[j + 1];
      let lastValue = ar[ar.length-1]
      let beforeLast = ar[ar.length-2]
      

      if (
        firstValue === undefined ||
        secondValue === undefined ||
        thirdValue === undefined
      ) {
        return ar;
      }

      if (
        firstValue.lastLine[0] === secondValue.firstLine[0] ||
        firstValue.lastLine[1] === secondValue.firstLine[1]
      ) {
        conflictIndexes.push(j);
        ar.push(ar.splice(j, 1)[0]);
        i--;

        if (
          firstValue.firstLine[0] === previousValue.lastLine[0] ||
          firstValue.firstLine[1] === previousValue.lastLine[1]
        ) {
          conflictIndexes.push(i);
          ar.push(ar.splice(i, 1)[0]);
          i -= 2;
        }
        if (lastValue.firstLine[0] === beforeLast.lastLine[0] ||
          lastValue.firstLine[1] === beforeLast.lastLine[1]) {
          // ar.unshift(ar.splice(ar[ar.length], 1)[0])
          // i = ar.length - 1
          ar.unshift(ar.splice(ar[ar.length], 1)[0])
          i = j -i
          }  
      }  else {
        i++;
      }
    }
  
  };
 
  const sortCantosSections = () => {
    let arr = catalog();
    let countArr = {};
    let lineValues = [];
    let section = [];
    let passed = [];
    let invertedCounts = [];
    let reversedCounts = [];
    let output;
   
   
   
    //group everything for final sorting
    for (let x = 0; x < 1000; x++) {
      const index = arr[x];
      invertedCounts = [
        ...invertedCounts,
        getWordsAndMargins(index[0], index[1]).invertedObj,
      ];
      reversedCounts = [
        ...reversedCounts,
        getWordsAndMargins(index[0], index[1]).reversedCount,
      ];
      section = [...section, getWordsAndMargins(index[0], index[1]).sections];
      lineValues = [
        ...lineValues,
        getWordsAndMargins(index[0], index[1]).lines,
      ];
      countArr = {
        ...countArr,
        ...getWordsAndMargins(index[0], index[1]).counts,
      };
    }
    // console.log("reversedCounts", reversedCounts);
    // console.log("counts", countArr);
    // console.log("rearranged", rearranged);
    // console.log("conflictIndexes", conflictIndexes);

    //sort the the canto sections twice and check for conflicts
    const rearranged = findConflicts(lineValues);
    // conflictIndexes = [];
    const secondRun = findConflicts(rearranged);
    // if (conflictIndexes.length) {
    //   findConflicts(secondRun)
    // }
    let sizedArr = secondRun.slice(0, size)
    let finalArr = [];

    if(size === 1) {
     let values = secondRun.section.split("-")
     return displayIndexSection(values[0], values[1]).join("") // changed from values[1]).join("/n") to remove line after each section
     } else { 
    sizedArr.map(({ section }) => {
      let values = section.split("-");
      finalArr = [...finalArr, displayIndexSection(values[0], values[1])];
      return finalArr;
    });
  }

     output = finalArr.join("");

    return {
      section,
      lineValues,
      countArr,
      passed,
      rearranged,
      output,
    };
  };
  
  return { cantoIndex, shuffledCantos, sortCantosSections };
}
export default formatCantos;
