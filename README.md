# Transmission-Client

### A Transmission Client on Node.js with TypeSctipt.

## Install

```bash
$ npm install transmission-client
```

## Types Support
We have Visual Studio Code TypeSctipt support in this package instead of installing @types/* package from npm.

## Usage

### Require/Import in JavaScript/TypeSctipt

In JavaScript:
```javascript
const Transmission = require('transmission-client').Transmission;
let Client = new Transmission();
```
In TypeSctipt:
```typescript
import { Transmission } from 'transmission-client';
let Client = new Transmission();
```