
export type ConnectionError = {type: 'connection'};
export type NoTokenError = {type: 'no-token'};
export type NotFoundError = {type: 'not-found'};
export type InvalidFieldsError = {type: 'invalid-fields', errors: {name: string, message: string}[]};
export type MissingFieldsError = {type: 'missing-fields', errors: {name: string, message: string}[]};
export type NameInUseError = {type: 'name-in-use', errors: {name: string, message: string}[]};
export type EmailInUseError = {type: 'email-in-use', message: string};
export type UnknownError = {type: 'unknown'};
export const AppErrors = {
    connectionError: {type: 'connection'} as ConnectionError,
    noTokenError: {type: 'no-token'} as NoTokenError,
    notFoundError: {type: 'not-found'} as NotFoundError,
    unknownError: {type: 'unknown'} as UnknownError,
}

export type AppError =
    | ConnectionError
    | NoTokenError
    | NotFoundError
    | InvalidFieldsError
    | MissingFieldsError
    | NameInUseError
    | EmailInUseError
    | UnknownError