# Utils Module

This module provides a collection of utility functions designed to support various operations within the `happy-server` project.

## Functions

### `uptime()`

Returns the system uptime in milliseconds since the process started.

#### Usage

```typescript
import { uptime } from './uptime';

const currentUptime = uptime();
console.log(`Server has been up for ${currentUptime} milliseconds.`);
```