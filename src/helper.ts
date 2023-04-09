// Referenece: https://gomakethings.com/how-to-add-a-new-item-to-an-object-at-a-specific-position-with-vanilla-js/
const addToObject = function (
  obj: Record<string, any>,
  key: string,
  value: any,
  index: number
) {
  // Create a temp object and index variable
  var temp: Record<string, any> = {};
  var i = 0;

  // If no index or if index greater than obj length, add to the end
  if (index > Object.keys(obj).length - 1 && key && value) {
    temp = { ...obj };
    temp[key] = value;
    return temp;
  }

  // Loop through the original object
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      // If the indexes match, add the new item
      if (i === index && key && value) {
        temp[key] = value;
      }

      // Add the current item in the loop to the temp obj
      temp[prop] = obj[prop];

      // Increase the count
      i++;
    }
  }

  return temp;
};

export { addToObject };
