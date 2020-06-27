export function stringToObject (value) {
  const newValues = {};
  Object.keys(value).forEach(key =>{
    const valueOfKey = value[key];
    if (!valueOfKey) {
      return;
    }

    if (typeof valueOfKey === 'string') {
      newValues[key] = {
        color: valueOfKey
      };
    } else {
      newValues[key] = valueOfKey;
    }
  });

  return newValues;
}
