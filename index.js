const Nanoresource = require('nanoresource')

const queue = Symbol('queue')
const ondoneBound = Symbol('on done')
const sync = Symbol('sync')
const prev = Symbol('prev')

module.exports = class Nanocursor extends Nanoresource {
  constructor (opts) {
    super(opts)

    this.position = 0
    this[sync] = false
    this[queue] = []
    this[ondoneBound] = ondone.bind(this)

    if (opts.next) this._next = opts.next
    if (opts.prev) this._prev = opts.prev
    if (opts.seek) this._seek = opts.seek
  }

  next (cb) {
    push(this, 0, 0, cb)
  }

  prev (cb) {
    push(this, 1, 0, cb)
  }

  seek (position, cb) {
    push(this, 2, position, cb)
  }

  _seek (position, cb) {
    cb(null)
  }

  _prev (cb) {
    cb(null, null)
  }

  _next (cb) {
    cb(null, null)
  }
}

function drain (self) {
  if (!self[queue].length) return
  const [type, arg] = self[queue][0]
  self[sync] = true
  switch (type) {
    case 0:
      self._next(self.position, self[ondoneBound])
      break
    case 1:
      if (self[prev] !== 1 && self.position > 0) self.position--
      self._prev(self.position, self[ondoneBound])
      break
    case 2:
      self._seek(arg, self[ondoneBound])
      break
  }
  self[prev] = type
  self[sync] = false
}

function noop () {}

function push (self, type, arg, cb) {
  if (!cb) cb = noop
  if (!self.opened) return openAndPush(self, type, arg, cb)
  if (!self.active(cb)) return
  self[queue].push([type, arg, cb])
  if (self[queue].length === 1) drain(self)
}

function openAndPush (self, type, arg, cb) {
  self.open(function (err) {
    if (err) return cb(err)
    push(self, type, arg, cb)
  })
}

function ondone (err, val) {
  if (this[sync]) return process.nextTick(this[ondoneBound], err, val)

  const [type, arg, cb] = this[queue].shift()

  if (err) {
    drain(this)
    return cb(err)
  }

  const pos = this.position

  if (val !== null) {
    switch (type) {
      case 0:
        this.position++
        break
      case 1:
        this.position--
        break
      case 2:
        this.position = arg
        break
    }
  }

  drain(this)

  switch (type) {
    case 0: return cb(null, val, pos)
    case 1: return cb(null, val, pos)
    case 2: return cb(null, val)
  }
}
