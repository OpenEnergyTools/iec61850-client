export const mmsTypes: Record<string, number> = {
  /*! this represents all MMS array types (arrays contain uniform elements) */
  MMS_ARRAY: 0,
  /*! this represents all complex MMS types (structures) */
  MMS_STRUCTURE: 1,
  /*! boolean value */
  MMS_BOOLEAN: 2,
  /*! bit string */
  MMS_BIT_STRING: 3,
  /*! represents all signed integer types */
  MMS_INTEGER: 4,
  /*! represents all unsigned integer types */
  MMS_UNSIGNED: 5,
  /*! represents all float type (32 and 64 bit) */
  MMS_FLOAT: 6,
  /*! octet string (unstructured bytes) */
  MMS_OCTET_STRING: 7,
  /*! MMS visible string */
  MMS_VISIBLE_STRING: 8,
  MMS_GENERALIZED_TIME: 9,
  MMS_BINARY_TIME: 10,
  MMS_BCD: 11,
  MMS_OBJ_ID: 12,
  /*! MMS unicode string */
  MMS_STRING: 13,
  /*! MMS UTC time type */
  MMS_UTC_TIME: 14,
  /*! This represents an error code as returned by MMS read services */
  MMS_DATA_ACCESS_ERROR: 15,
};

const lib = Deno.dlopen("./libiec61850.so", {
  MmsValue_getType: {
    parameters: ["pointer"],
    result: "u8",
  },
  MmsValue_getBoolean: {
    parameters: ["pointer"],
    result: "u8",
  },
  MmsValue_getBitStringSize: {
    parameters: ["pointer"],
    result: "u32",
  },
  MmsValue_getBitStringBit: {
    parameters: ["pointer", "u8"],
    result: "u8",
  },
  MmsValue_toInt64: {
    parameters: ["pointer"],
    result: "i64",
  },
  MmsValue_toUint32: {
    parameters: ["pointer"],
    result: "u32",
  },
  MmsValue_toFloat: {
    parameters: ["pointer"],
    result: "f32",
  },
  MmsValue_toDouble: {
    parameters: ["pointer"],
    result: "f64",
  },
  MmsValue_getOctetStringOctet: {
    parameters: ["pointer","u16"],
    result: "u16",
  },
  MmsValue_getOctetStringSize: {
    parameters: ["pointer"],
    result: "u16",
  },
  MmsValue_toString: {
    parameters: ["pointer"],
    result: "pointer",
  },
  MmsValue_getUtcTimeInMs: {
    parameters: ["pointer"],
    result: "i64",
  }
});

function getBitString(mmsValue: Deno.PointerValue): string {
  const size = lib.symbols.MmsValue_getBitStringSize(mmsValue);

  let bitString = "";
  for (let i = 0; i < size; i++ ) {
    const bit =  lib.symbols.MmsValue_getBitStringBit(mmsValue, i);
    bitString = bitString + bit;	
  }

  return bitString;
}

function getOctetString(mmsValue: Deno.PointerValue): string {
  const size = lib.symbols.MmsValue_getOctetStringSize(mmsValue);
  
  let octString = "";
  for (let i = 0;i < size;i++) {
     const dec = lib.symbols.MmsValue_getOctetStringOctet(mmsValue,i);
     octString = octString + dec.toString(16).padStart(2,0).toUpperCase();
  }
	
  return "0x" + octString;
}

function getCString(mmsValue: Deno.PointerValue): string {
    const ptr = lib.symbols.MmsValue_toString(mmsValue);
    return new Deno.UnsafePointerView(ptr).getCString();
}

function getUctTime(mmsValue: Deno.PointerValue): string {
    const ms = lib.symbols.MmsValue_getUtcTimeInMs(mmsValue);
    return new Date(ms).toISOString();
}

export function getMmsValue(
  mmsValue: Deno.PointerValue,
  bType: string
): string | boolean | number | bigint | undefined {
  const mmsType = lib.symbols.MmsValue_getType(mmsValue);

  console.log(mmsType);
  // MMS_DATA_ACCESS_ERROR
  if (mmsType === 15) return;
  // MMS_DATA_BOOLEAN && SCL bType BOOLEAN
  if (mmsType === 2)
    return lib.symbols.MmsValue_getBoolean(mmsValue) === 1;
  // MMS_DATA_BITSTRING && SCL bType BOOLEAN
  if (mmsType === 3)
    return getBitString(mmsValue);
  // MMS_DATA_INTEGER && SCL bType "INTxx"
  if (mmsType === 4 && bType.startsWith("INT"))
    return lib.symbols.MmsValue_toInt64(mmsValue);
  if (mmsType === 5 && bType.startsWith("INT"))
    return lib.symbols.MmsValue_toUint32(mmsValue);
  // MMS_DATA_FLOAT && SCL bType FLOAT32
  if (mmsType === 6 && bType === "FLOAT32")
    return lib.symbols.MmsValue_toFloat(mmsValue);
  // MMS_DATA_FLOAT && SCL bType FLOAT64
  if (mmsType === 6 && bType === "FLOAT64")
    return lib.symbols.MmsValue_toDouble(mmsValue);
  // MMS_OCTET_STRING
  if (mmsType === 7)
    return getOctetString(mmsValue);
  // MMS_STRING || MMS_OCTET_STRING
  if (mmsType === 8 || mmsType === 13)
    return getCString(mmsValue);
  // MMS_UCT_TIME
  if (mmsType === 14)
    return getUctTime(mmsValue);
  
  return;
}

