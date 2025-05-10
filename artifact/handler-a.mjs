// src/util/sum.ts
var sumNumbers = (...items) => {
  return items.reduce((accumulator, item) => accumulator + item, 0);
};

// src/handler/handler-a.ts
var handlerA = (numbers2) => {
  return sumNumbers(...numbers2);
};
var numbers = [1, 2, 3, 4, 5];
var result = handlerA(numbers);
console.log(`Sum of ${numbers} is ${result}`);
export {
  handlerA
};
