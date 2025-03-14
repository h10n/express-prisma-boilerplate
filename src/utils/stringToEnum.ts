const stringToEnum = <T extends object>(
  value: string,
  enumObject: T,
  defaultValue?: T[keyof T],
): T[keyof T] => {
  if (Object.keys(enumObject).includes(value)) {
    return enumObject[value as keyof T];
  }

  if (Object.values(enumObject).includes(value)) {
    return value as T[keyof T];
  }

  const numericValue = parseFloat(value);
  if (
    !isNaN(numericValue) &&
    Object.values(enumObject).includes(numericValue)
  ) {
    return numericValue as T[keyof T];
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Invalid enum value: ${value}`);
};

export default stringToEnum;
