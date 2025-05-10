/**
 * Sums up all the given numbers.
 * 
 * @param {number[]} items The numbers to sum up.
 *  
 * @returns {number} The sum of the numbers.
 */
export const sumNumbers = (...items: number[]) => {
  return items.reduce((accumulator, item) => accumulator + item, 0);
};
