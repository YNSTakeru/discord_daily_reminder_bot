function createInvertedMap(values) {
  const invertedMap = new Map();

  values.forEach((value, key) => {
    if (!invertedMap.has(value)) {
      invertedMap.set(value, [key]);
    } else {
      invertedMap.get(value).push(key);
    }
  });

  return invertedMap;
}

module.exports = createInvertedMap;
