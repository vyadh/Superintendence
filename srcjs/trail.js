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
  this.skip = 3
  this.colours = Array(this.initialCount)
  this.optimise = true

  // Pre-generate colours for each count
  for (var count=this.initialCount; count>=0; count-=this.step) {
    this.colours[count] = "rgb(0, 0, " + count + ")"
  }

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
  this.tick = function(clock, decodeFunction) {
    this.data.flip()

    for (var i = 0; i < this.data.size(); i++) {
      var encoded = this.data.get(i)
      var index = encoded >>> 8
      var count = encoded & 0xff

      // Only positive counts are propogated, compacting the map
      if (count > 0) {

        // Optimise away the very dark colours
        if (count < 50 && this.optimise) {
          count = this.step
        }

        if (this.isDecode(clock, count)) {
          decodeFunction(index, count)
          this.put(index, count - this.step)
        } else {
          // Need to maintain existing value
          this.put(index, count)
        }
      }
    }
  }

  /* Always update on cell death, then update in increments */
  this.isDecode = function(clock, count) {
    return count === this.initialCount || clock % this.skip === 0
  }

}
