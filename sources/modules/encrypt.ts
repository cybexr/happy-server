import { KeyTree, crypto } from "privacy-kit";

let keyTree: KeyTree | null = null;

export async function initEncrypt() {
    const masterSecret = process.env.HANDY_MASTER_SECRET ?? 'default-dev-key-change-in-production';

    if (!process.env.HANDY_MASTER_SECRET) {
        console.warn('⚠️  HANDY_MASTER_SECRET not set - using default development key. This is NOT secure for production!');
    }

    keyTree = new KeyTree(await crypto.deriveSecureKey({
        key: masterSecret,
        usage: 'happy-server-tokens'
    }));
}

export function encryptString(path: string[], string: string) {
    return keyTree!.symmetricEncrypt(path, string);
}

export function encryptBytes(path: string[], bytes: Uint8Array) {
    return keyTree!.symmetricEncrypt(path, bytes);
}

export function decryptString(path: string[], encrypted: Uint8Array) {
    return keyTree!.symmetricDecryptString(path, encrypted);
}

export function decryptBytes(path: string[], encrypted: Uint8Array) {
    return keyTree!.symmetricDecryptBuffer(path, encrypted);
}