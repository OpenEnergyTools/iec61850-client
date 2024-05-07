import {iedClientErrors} from "./foundation/errors.ts"
import {getMmsValue} from "./mmsValue.ts"

const lib = Deno.dlopen("./libiec61850.so", {
  IedConnection_create: {
    parameters: [],
    result: "pointer",
  },
  IedConnection_connect: {
    parameters: ["pointer", "buffer", "buffer", "u32"],
    result: "void",
  },
  FunctionalConstraint_fromString: {
    parameters: ["buffer"],
    result: "u32",
  },
  IedConnection_readObject: {
    parameters: ["pointer", "buffer", "buffer", "u32"],
    result: "pointer",
  },
  MmsValue_getType: {
    parameters: ["pointer"],
    result: "u32",
  },
});

function cString(str: string): Uint8Array {
  return new TextEncoder().encode(`${str}\0`);
}

export function readValue(
  conn: Deno.PointerValue,
  ref: string,
  fc: string,
  bType: string
): string {
  const fcNum = lib.symbols.FunctionalConstraint_fromString(cString(fc));

  const errors = new Uint8Array(1);
  errors[0] = 100;

  const mmsValue = lib.symbols.IedConnection_readObject(
    conn,
    errors,
    cString(ref),
    fcNum
  );

  const value = getMmsValue(mmsValue,bType);

  return `${value}`;
}
