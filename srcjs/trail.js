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

  this.data = FlipArray.create(size)

  this.add = function(index, count) {
    this.data.add(index << 8 | count & 0xff)
  }

  /*
   * Emits the decoded values to the function, as well as creating a new set of
   * values for the next decode, where the count has been decremented. Counts
   * at zero or less are not propagated to the next decode.
   */
  this.tick = function(decodeFunction) {
    this.data.flip()
    this.data.reset()

    for (var i = 0; i < this.data.readSize; i++) {
      var encoded = this.data.read[i]
      var index = encoded >>> 8
      var count = encoded & 0xff

      if (count > 0) {
        decodeFunction(index, count)
        this.add(index, count - 1)
      }
    }
  }

}