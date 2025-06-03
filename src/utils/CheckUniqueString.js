export const getNextUniqueName = (baseName, items) => {
  const regex = new RegExp(`^${baseName}(-\\d+)*$`);

  const matchingItems = items.filter(item => regex.test(item.name));

  const suffixes = matchingItems.map(item => {
    const parts = item.name.replace(baseName, '').split('-').filter(Boolean);
    const nums = parts.map(num => parseInt(num)).filter(n => !isNaN(n));
    return nums.length ? nums[nums.length - 1] : 0;
  });

  const nextSuffix = suffixes.length ? Math.max(...suffixes) + 1 : 1;

  const newName = `${baseName}-${nextSuffix}`;
  return newName;
};
