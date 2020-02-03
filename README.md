# nanocursor

Small cursor abstraction that can seek, go forward, and go backwards.

```
npm install nanocursor
```

## Usage

``` js
const Nanocursor = require('nanocursor')

const cursor = new Nanocursor({
  seek (pos, cb) {
    // should seek to pos
    cb(null)
  },
  next (cb) {
    // read the next item and return it
    cb(null, ...)
  },
  prev (cb) {
    // read the prev item and return it
    cb(null, ...)
  }
})
```

## API

#### `cursor = new Cursor([options])`

Make a new cursor. Optionally pass in `seek`, `next`, `prev` as the implementation for the those corresponding calls.

#### `cursor.seek(position, [callback])`

Seek the cursor.

#### `cursor._seek(position, callback)`

Override this method to add seek logic.
Only one `_prev`, `_next`, or `_seek` call will be active at the time.

#### `cursor.next(callback)`

Get the next cursor item.

#### `cursor._next(position, callback)`

Override this method to add next logic.
Only one `_prev`, `_next`, or `_seek` call will be active at the time.

#### `cursor.prev(callback)`

Get the prev cursor item.

#### `cursor._prev(position, callback)`

Override this method to add prev logic.
Only one `_prev`, `_next`, or `_seek` call will be active at the time.

## License

MIT
