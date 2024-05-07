import {iedClientErrors} from "./foundation/errors.ts"
import {functionalConstriansi} from "./foundation/fc.ts"
import {cString} from "./foundation/utils.ts"

const lib = Deno.dlopen("./libiec61850.so",{
        IedConnection_create: {
                parameters: [],
                result: "pointer",
        },
        IedConnection_connect: {
                parameters: ["pointer","buffer", "buffer", "u32"],
                result: "void",
        },
	IedConnection_close: {
                parameters: ["pointer"],
                result: "void",
        },
	IedConnection_destroy: {
                parameters: ["pointer"],
                result: "void",
        },
	IedConnection_release: {
		parameters: ["pointer"],
		result: "void",
	},
	IedConnection_readObject: {
		parameters: ["pointer","buffer","buffer","u32"],
		result: "pointer",
	},
	FunctionalConstraint_fromString: {
		parameters: ["buffer"],
		result: "u32",
	},
	FunctionalConstraint_toString: {
		parameters: ["u32"],
		result: "pointer",
	},
	MmsValue_getType: {
		parameters: ["pointer"],
		result: "u32",
	},
	MmsValue_getBitStringAsInteger: {
		parameters: ["pointer"],
		result: "u32",
	},
});

export function associate( 
  host: string, 
  port: number 
): { conn: Deno.PointerValue, error: Error } { 
  const conn = lib.symbols.IedConnection_create(); 
 
  const errors = new Uint8Array(1); 
  errors[0] = 100; // Default to unused 
 
  lib.symbols.IedConnection_connect(conn, errors, cString(host), port); 
 
  const is = errors[0] !== 0; 
  const error_msg = iedClientErrors[errors[0]]; 
  
  return { 
    conn, 
    error: { is: errors[0] !== 0, error_msg: iedClientErrors[errors[0]] }, 
  }; 
}

export function release(conn:Deno.PointerValue): void {
  lib.symbols.IedConnection_release(conn);
}

export function connDestroy(conn:Deno.PointerValue): void {
  lib.symbols.IedConnection_close(conn);
  lib.symbols.IedConnection_destroy(conn);
}

