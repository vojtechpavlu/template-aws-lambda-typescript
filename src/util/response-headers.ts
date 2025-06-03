/**
 * Headers for the response to be sent to the client and to
 * support CORS
 *
 * @param {string} origin The origin of the request. Default is '*'.
 *
 * @returns {Record<string, string>} The headers for the response.
 */
export const getResponseHeaders = (origin: string = '*') => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
  'Access-Control-Allow-Origin': origin,
});
