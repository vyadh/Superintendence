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
  return new FlipArray(new Array(size), 0, new Array(size), 0)
}

/*
 * Simulate a set-like data structure using the flip array,
 * only adding changes if they don't exist.
 */
function FlipSet(size) {

  this.setView = new Array(size)
  this.array = FlipArray.create(size)

  this.add = function(value) {
    if (!this.setView[value]) {
      this.setView[value] = true
      this.array.add(value)
    }
  }

  this.consume = function() {
    this.setView = new Array(size) //todo overhead
    this.array.flip()
    this.array.reset()
    return this.array
  }

}
