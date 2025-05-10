import { generateRandomString, IdentifierGenerationConfig } from '../util';

/**
 * Default configuration for identifier generation.
 * It uses a random string generator with a length of 16 characters and a maximum of 10 retries.
 * This configuration is used to generate unique identifiers for notes.
 *
 * @returns {IdentifierGenerationConfig} The configuration object for identifier generation
 */
export const identifierGenerationConfig = (): IdentifierGenerationConfig => ({
  generator: generateRandomString,
  length: 16,
  maxRetries: 10,
});
