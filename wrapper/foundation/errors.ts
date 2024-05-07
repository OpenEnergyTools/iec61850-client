export const iedClientErrors: Record<number, string> = {
    /* general errors */
    /** No error occurred - service request has been successful */
    0: "IED_ERROR_OK",
    /** The service request can not be executed because the client is not yet connected */
    1: "IED_ERROR_NOT_CONNECTED",
    /** Connect service not execute because the client is already connected */
    2: "IED_ERROR_ALREADY_CONNECTED",
    /** The service request can not be executed caused by a loss of connection */
    3: "IED_ERROR_CONNECTION_LOST",
    /** The service or some given parameters are not supported by the client stack or by the server */
    4: "IED_ERROR_SERVICE_NOT_SUPPORTED",
    /** Connection rejected by server */
    5: "IED_ERROR_CONNECTION_REJECTED",
    /** Cannot send request because outstanding call limit is reached */
    6: "IED_ERROR_OUTSTANDING_CALL_LIMIT_REACHED",
    /* client side errors */
    /** API function has been called with an invalid argument */
    10: "IED_ERROR_USER_PROVIDED_INVALID_ARGUMENT",
    11: "IED_ERROR_ENABLE_REPORT_FAILED_DATASET_MISMATCH",
    /** The object provided object reference is invalid (there is a syntactical error). */
    12: "IED_ERROR_OBJECT_REFERENCE_INVALID",
    /** Received object is of unexpected type */
    13: "IED_ERROR_UNEXPECTED_VALUE_RECEIVED",
    /* service error - error reported by server */
    20: "IED_ERROR_TIMEOUT",
    /** The server rejected the access to the requested object/service due to access control */
    21: "IED_ERROR_ACCESS_DENIED",
    /** The server reported that the requested object does not exist (returned by server) */
    22: "IED_ERROR_OBJECT_DOES_NOT_EXIST",
    /** The server reported that the requested object already exists */
    23: "IED_ERROR_OBJECT_EXISTS",
    /** The server does not support the requested access method (returned by server) */
    24: "IED_ERROR_OBJECT_ACCESS_UNSUPPORTED",
    /** The server expected an object of another type (returned by server) */
    25: "IED_ERROR_TYPE_INCONSISTENT",
    /** The object or service is temporarily unavailable (returned by server) */
    26: "IED_ERROR_TEMPORARILY_UNAVAILABLE",
    /** The specified object is not defined in the server (returned by server) */
    27: "IED_ERROR_OBJECT_UNDEFINED",
    /** The specified address is invalid (returned by server) */
    28: "IED_ERROR_INVALID_ADDRESS",
    /** Service failed due to a hardware fault (returned by server) */
    29: "IED_ERROR_HARDWARE_FAULT",
    /** The requested data type is not supported by the server (returned by server) */
    30: "IED_ERROR_TYPE_UNSUPPORTED",
    /** The provided attributes are inconsistent (returned by server) */
    31: "IED_ERROR_OBJECT_ATTRIBUTE_INCONSISTENT",
    /** The provided object value is invalid (returned by server) */
    32: "IED_ERROR_OBJECT_VALUE_INVALID",
    /** The object is invalidated (returned by server) */
    33: "IED_ERROR_OBJECT_INVALIDATED",
    /** Received an invalid response message from the server */
    34: "IED_ERROR_MALFORMED_MESSAGE",
    /** Service not implemented */
    98: "IED_ERROR_SERVICE_NOT_IMPLEMENTED",
    /** unknown error */
    99: "IED_ERROR_UNKNOWN"
}
