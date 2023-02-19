# `@geccles/streak-counter` - a basic streak counter

This is a basic streak counter that is meant for the browser and leverages `local storage`

## Install

```shell
npm install @geccles/streak-counter
```

### Usage

```typescript
import { streakCounter } from "@geccles/streak-counter"

const today = new Date()
const streak = streakCounter(localStorage, today)

/** 
 * streak returns a object:
 * {
 *      currentCount: 1,
 *      lastLoginDate: "02/19/2023",
 *      startDate: "02/19/2023"
 * }
*/
```
