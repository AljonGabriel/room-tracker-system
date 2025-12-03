import colorPalette from '../data/colorPalette.js';

const getColorClass = (fullName = '') => {
  // take the first word before any spaces or dash
  const firstWord = fullName.split(' ')[0].replace('-', '').trim();

  // lookup in palette
  return (
    colorPalette[firstWord] || { border: 'border-gray-400', bg: 'bg-gray-400' }
  );
};

export default getColorClass;
