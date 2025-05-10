import crypto from 'node:crypto';

/**
 * Declaration of a random string generator function type.
 * The function takes a number as an argument and returns a string.
 */
export type RandomStringGenerator = (length: number) => string;

/**
 * Configuration object for generating unique identifiers.
 * It contains the length of the identifier, the generator function,
 * and the maximum number of retries allowed to generate a unique identifier.
 */
export type IdentifierGenerationConfig = {
  length: number;
  generator: RandomStringGenerator;
  maxRetries: number;
};

/**
 * Declaration of a uniqueness check callback function type.
 *
 * The function takes a string identifier as an argument and returns
 * a Promise that resolves to a boolean indicating whether the identifier
 * is unique (`true`) or not (`false`).
 */
export type UniquenessCheckCallback = (identifier: string) => Promise<boolean>;

/**
 * Generates a random string consisting of hexadecimal characters
 * of the specified length. The string is generated using the
 * crypto module's randomBytes function.
 *
 * @param {number} length The length of the string to generate.
 *
 * @returns {string} A random string of the specified length.
 *
 * @throws {TypeError} If the length is not a number.
 * @throws {Error} If the length is not a positive integer greater than 1.
 */
export const generateRandomString: RandomStringGenerator = (
  length: number
): string => {
  if (typeof length !== 'number') {
    throw new TypeError('Length must be a number');
  } else if (length < 1) {
    throw new Error('Length must be greater than 0');
  } else if (!Number.isInteger(length)) {
    throw new TypeError('Length must be an integer');
  }

  // Generate a random hexadecimal string of the specified length
  // (a byte consists of two characters in hex)
  return crypto.randomBytes(length / 2).toString('hex');
};

/**
 * Generates a unique identifier using the provided configuration
 * and checks its uniqueness using the provided callback function.
 * 
 * The identifier is generated using the specified generator function
 * and is retried up to the specified maximum number of retries
 * if it is not unique.
 * 
 * @param {IdentifierGenerationConfig} config Configuration object for generating the identifier.
 * @param {UniquenessCheckCallback} uniquenessCheck Callback function to check the uniqueness of the identifier.
 * 
 * @returns {Promise<string>} A promise that resolves to a unique identifier.
 * 
 * @throws {Error} If the maximum number of retries is reached without generating a unique identifier.
 */
export const generateUniqueIdentifier = async (
  config: IdentifierGenerationConfig,
  uniquenessCheck: UniquenessCheckCallback
): Promise<string> => {
  const { length, generator, maxRetries } = config;

  for (let trial = 0; trial < maxRetries; trial++) {
    const identifier = generator(length);

    // Check if the generated identifier is unique
    if (await uniquenessCheck(identifier)) {
      return identifier;
    }
  }

  throw new Error(
    `Failed to generate a unique identifier after maximum retries (maxRetries: ${maxRetries})`
  );
};
