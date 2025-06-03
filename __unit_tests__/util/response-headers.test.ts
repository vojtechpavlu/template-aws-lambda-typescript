import { getResponseHeaders } from '../../src';

describe('Response Headers utility function', () => {
  it('should return default headers with "*" as origin when no argument is provided', () => {
    const headers = getResponseHeaders();
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE',
      'Access-Control-Allow-Origin': '*',
    });
  });

  it('should set the Access-Control-Allow-Origin header to the provided origin', () => {
    const origin = 'https://example.com';
    const headers = getResponseHeaders(origin);
    expect(headers['Access-Control-Allow-Origin']).toBe(origin);
  });

  it('should always include Content-Type as application/json', () => {
    const headers = getResponseHeaders('https://another.com');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should always include Access-Control-Allow-Methods with correct methods', () => {
    const headers = getResponseHeaders();
    expect(headers['Access-Control-Allow-Methods']).toBe(
      'OPTIONS,GET,POST,PUT,DELETE'
    );
  });

  it('should return an object with all expected header keys', () => {
    const headers = getResponseHeaders();
    expect(Object.keys(headers).sort()).toEqual(
      [
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Origin',
        'Content-Type',
      ].sort()
    );
  });
});
