export type Connection = {
  host: string;
  port: number;
};

export type ReadValue = {
  ref: string;
  fc: string;
  bType: string;
};

export type Associate = {
  type: "associate";
  conn: Connection;
};

export type Release = {
  type: "release";
  conn: Connection;
};

export type Read = {
  type: "read";
  conn: Connection;
  vals: ReadValue[];
};

export type MmsEvent = Associate | Read | Release;

export function isConnection(conn: any): conn is Connection {
  return conn.host !== undefined && conn.port !== undefined;
}

export function isMmsEvent(msg: any): msg is MmsEvent {
  return msg.type !== undefined && isConnection(msg.conn);
}

export function isAssociate(msg: any): msg is Associate {
  return isMmsEvent(msg) && msg.type === "associate";
}

function isReadVal(val: any): val is ReadValue {
  return val.ref !== undefined && val.fc !== undefined && val.bType !== undefined;
}

export function isRelease(msg: any): msg is Release {
  return isMmsEvent(msg) && msg.type === "release"; 
}

export function isRead(msg: any): msg is Read {
  return isMmsEvent(msg) && msg.type === "read";
}
