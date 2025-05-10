/**
 * Returns the value of an environment variable by name.
 * When not set, it returns undefined.
 *
 * @param {string} name Name of the environment variable
 * @param {false} required Whether the variable is required or not
 *
 * @returns {string | undefined} The value of the environment variable or undefined
 */
export function environmentVariable(
  name: string,
  required: false
): string | undefined;

/**
 * Returns the value of an environment variable by name.
 * When not set, it throws an error.
 *
 * @param {string} name Name of the environment variable
 * @param {true} required Whether the variable is required or not
 *
 * @returns {string} The value of the environment variable
 *
 * @throws {Error} If the variable is not set
 */
export function environmentVariable(name: string, required: true): string;

/**
 * Returns the value of an environment variable by name.
 * When not set and is a required variable, it throws an error.
 *
 * @param {string} name Name of the environment variable
 * @param {true} required Whether the variable is required or not
 *
 * @returns {string} The value of the environment variable
 *
 * @throws {Error} If the variable is required and not set
 */
export function environmentVariable(
  name: string,
  required: boolean
): string | undefined {
  const value = process.env[name];

  if (!value && required) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}
