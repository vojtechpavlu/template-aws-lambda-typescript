// src/util/casing.ts
var toUpperCase = (string_) => {
  return string_.toUpperCase();
};

// src/handler/handler-b.ts
var handlerB = (data) => toUpperCase(typeof data);
export {
  handlerB
};
