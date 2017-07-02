/*
 * A fixed array allowing a two-phase read/write cycle, where the first
 * phase writes, the array is flipped so that the previous phase can be
 * read. This avoids unnecessary array creation.
 */
function FlipArray(read, readSize, write, writeSize) {

  this.write = write
  this.writeSize = writeSize
  this.read = read
  this.readSize = readSize

  this.size = function() {
    return this.readSize
  }

  this.get = function(i) {
    return this.read[i]
  }

  this.add = function(value) {
    this.write[this.writeSize++] = value
  }

  this.flip = function() {
    var t = this.write
    this.write = this.read
    this.read = t

    var tSize = this.writeSize
    this.writeSize = this.readSize
    this.readSize = tSize
  }

  this.reset = function() {
    this.writeSize = 0
  }

}

FlipArray.create = function(size) {
  return new FlipArray(Array(size), 0, Array(size), 0)
}

/*
 * Simulate a set-like data structure using the flip array,
 * only adding changes if they don't exist.
 */
function FlipSet(size) {

  this.array = FlipArray.create(size)
  this.setView = Array(size)

  this.size = function() {
    return this.array.readSize
  }

  this.get = function(i) {
    return this.array.read[i]
  }

  this.add = function(value) {
    if (!this.setView[value]) {
      this.setView[value] = true
      this.array.add(value)
    }
  }

  this.consume = function() {
    this.setView.fill(false)
    this.array.flip()
    this.array.reset()
    return this.array
  }

}

/*
 * Simulate a map by keeping an index of the value positions.
 * Can only be used for positive values.
 */
function FlipMap(size) {

  this.array = FlipArray.create(size)
  this.index = Array(size)

  this.size = function() {
    return this.array.readSize
  }

  this.get = function(i) {
    return this.array.read[i]
  }

  this.put = function(key, value) {
    var index = this.index[key]
    if (typeof index == 'undefined') {
      this.index[key] = this.array.writeSize
      this.array.add(value)
    } else {
      this.array.write[index] = value
    }
  }

  this.remove = function(key) {
    this.put(key, -1)
  }

  this.flip = function() {
    this.array.flip()
    this.array.reset()
    this.index = Array(size)
  }

  this.flipCompact = function() {
    // Flip for compaction
    this.array.flip()
    this.array.reset()

    // Compact (non-zero values)
    for (var i=0; i<this.array.readSize; i++) {
      var value = this.array.read[i]
      if (value >= 0) {
        this.array.add(value)
      }
    }

    // Flip fror reading compacted version
    this.array.flip()
    this.array.reset()

    // Reset index
    this.index = Array(size)
  }

  this.consume = function() {
    this.array.flip()
    this.array.reset()
    return this.array
  }

}
