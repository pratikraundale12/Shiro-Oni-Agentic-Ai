export const getNextUniqueName = (baseName, items) => {
  const regex = new RegExp(`^${baseName}(-\\d+)?$`);

  // Match items with same base name or baseName-N format
  const matchingItems = items.filter(item => regex.test(item.name));

  // Extract existing suffix numbers
  const suffixes = matchingItems.map(item => {
    const parts = item.name.split('-');
    const num = parseInt(parts[1]);
    return isNaN(num) ? 0 : num;
  });

  const calculatedNextSuffix = suffixes.length ? Math.max(...suffixes) + 1 : 1;

  // Trim base if needed
  const suffixStr = `-${calculatedNextSuffix}`;
  const trimmedBase = baseName.slice(0, 30 - suffixStr.length);
  return `${trimmedBase}${suffixStr}`;
};
