
export interface Keys {
  masterKey: string
  stretchedMasterKey: string
}

export interface UserKeys {
  userId?: string
  key: string
}

export interface TableColumn {
  key: string
  label: string
}

export interface TableRow {
  [key: string]: any
}
