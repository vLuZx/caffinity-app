import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export type UserId = string & { readonly __brand: unique symbol };

export function isValidUserId(id: string): id is UserId {
    return uuidValidate(id) && uuidVersion(id) === 4;
}

export function toUserId(id: string): UserId {
    if (!isValidUserId(id)) {
        throw new Error(`Invalid UserId format: ${id}`);
    }
    return id as UserId;
}
