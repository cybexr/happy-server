# KV Module API

This document describes the API for the KV module, focusing on key-value pair mutation operations.

## `KVMutation` Interface

Defines the structure for a single key-value mutation operation.

```typescript
export interface KVMutation {
    key: string;
    value: string | null; // null = delete (sets value to null but keeps record)
    version: number; // Always required, use -1 for new keys
}
```

### Properties

*   `key`: `string`
    *   The key of the key-value pair to mutate.
*   `value`: `string | null`
    *   The new value for the key. If `null`, it signifies a delete operation, which sets the value to `null` but keeps the record with an incremented version.
*   `version`: `number`
    *   The expected version of the key-value pair. Always required. Use `-1` for creating new keys.

## `KVMutateResult` Interface

Defines the structure of the result returned by the `kvMutate` function.

```typescript
export interface KVMutateResult {
    success: boolean;
    results?: Array<{
        key: string;
        version: number;
    }>;
    errors?: Array<{
        key: string;
        error: 'version-mismatch';
        version: number;
        value: string | null;  // Current value (null if deleted)
    }>;
}
```

### Properties

*   `success`: `boolean`
    *   Indicates whether all mutations were successful (`true`) or if any failed (`false`).
*   `results`?: `Array<{ key: string; version: number; }>`
    *   Optional. An array of objects, each containing the `key` and the new `version` of the successfully mutated key-value pair. Present only if `success` is `true`.
*   `errors`?: `Array<{ key: string; error: 'version-mismatch'; version: number; value: string | null; }>`
    *   Optional. An array of error objects. Present only if `success` is `false`.
    *   Each error object contains:
        *   `key`: `string` - The key that failed to mutate.
        *   `error`: `'version-mismatch'` - The type of error, currently only 'version-mismatch'.
        *   `version`: `number` - The current version of the key in the store, allowing the client to reconcile.
        *   `value`: `string | null` - The current value associated with the key (null if deleted), encoded in Base64.

## `kvMutate` Function

Atomically mutates multiple key-value pairs within a transaction. All mutations either succeed or all fail.

```typescript
export async function kvMutate(
    ctx: { uid: string },
    mutations: KVMutation[]
): Promise<KVMutateResult>
```

### Parameters

*   `ctx`: `{ uid: string }`
    *   **uid**: `string` - The user ID associated with the account performing the mutations.
*   `mutations`: `KVMutation[]`
    *   An array of `KVMutation` objects, each specifying a key, its new value (or `null` for deletion), and the expected current version.

### Returns

*   `Promise<KVMutateResult>`
    *   A promise that resolves to a `KVMutateResult` object, indicating the success or failure of the batch operation and providing details on results or errors.

### Behavior

*   **Atomicity**: All provided mutations are applied within a single database transaction. If any mutation fails (e.g., due to a version mismatch), the entire transaction is rolled back, and no changes are persisted.
*   **Version Control**: A `version` number is always required for each mutation.
    *   For new keys, `version` should be `-1`. The key is then created with `version: 0`.
    *   For existing keys, `version` must match the current stored version. If it matches, the key's version is incremented by 1.
    *   If `version` does not match for an existing key, a `'version-mismatch'` error is returned.
*   **Deletion**: Setting `value` to `null` performs a "soft delete". The record is kept, its value is set to `null`, and its version is incremented.
*   **Notifications**: Upon successful completion of all mutations, a single bundled update notification is sent via `eventRouter` for all changes within the batch.
