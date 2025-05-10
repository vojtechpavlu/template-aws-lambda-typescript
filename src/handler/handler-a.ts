import { sumNumbers } from '../util';

export const handlerA = (numbers: number[]) => {
  return sumNumbers(...numbers);
};

const numbers = [1, 2, 3, 4, 5];
const result = handlerA(numbers);

console.log(`Sum of ${numbers} is ${result}`);
