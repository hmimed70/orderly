exports.validateInput = (inputData, requiredFields) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!inputData[field] || inputData[field].trim() === '') {
        missingFields.push(field);
      }
    });
  
    return missingFields;
  };
  