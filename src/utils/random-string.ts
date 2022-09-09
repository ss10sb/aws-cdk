import * as crypto from "crypto";

export function randomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}