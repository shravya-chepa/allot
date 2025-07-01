
export const helper = (inputArray, filterDate) => {

    function convertArrayToFormat(array) {
      
    const result = {};

        array?.forEach((item) => {
        
         const dateKey = item.startTime.slice(0, 10);
         const time = item.startTime.slice(11, 16);

      if (!result[dateKey]) {
        result[dateKey] = [];
      }

      result[dateKey].push(time);
    });

    return result;
  }

  function filterByDate(formattedData, filterDate) {
    const dateKey = filterDate.slice(0, 10);
    return formattedData[dateKey] || [];
  }

  const formattedResult = convertArrayToFormat(inputArray);

  const filteredResult = filterByDate(formattedResult, filterDate);

  return filteredResult;
};


