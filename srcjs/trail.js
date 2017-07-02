/*
 * Represents trails on the grid by holding a matrix of the index with a count,
 * where 0 is completely faded. Every tick, the current count is consumed from
 * the active list, and count-1 is appended to the backup. The existing trail
 * is painted completely, which should only be as long as non-faded cells.
 *
 * For efficiency, the (x, y) position as well as the count are encoded as each
 * element in an int array. The lower 8-bits being the count, the remaining
 * upper 24-bits being the encoded index (x, y).
 */
function Trail(size) {

  this.data = new FlipMap(size)
  this.initialCount = 250
  this.step = 10

  this.refresh = function(index) {
    this.put(index, this.initialCount)
  }

  this.put = function(index, count) {
    this.data.put(index, index << 8 | count & 0xff)
  }

  /* For efficiency, mark count as zero on removal. */
  this.remove = function(index) {
    this.put(index, 0)
  }

  /*
   * Emits the decoded values to the function, as well as creating a new set of
   * values for the next decode, where the count has been decremented. Counts
   * at zero or less are not propagated to the next decode.
   */
  this.tick = function(decodeFunction) {
    this.data.flip()
    this.data.array.reset()

    for (var i = 0; i < this.data.array.readSize; i++) {
      var encoded = this.data.array.read[i]
      var index = encoded >>> 8
      var count = encoded & 0xff

      if (count > 0) {
        decodeFunction(index, count)
        this.put(index, count - this.step)
      }
    }
  }

}
