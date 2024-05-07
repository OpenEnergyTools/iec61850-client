/** returns C type string - char* ending with \0 */
export function cString(str: string): Uint8Array {
  return new TextEncoder().encode(`${str}\0`);
}
