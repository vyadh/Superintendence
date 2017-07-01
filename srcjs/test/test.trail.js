var assert = chai.assert;

suite('Trail', function() {

  suite('add', function() {

    test('added encoded items can be decoded', function() {
      var trail = new Trail(10)
      trail.add(8, 5)
      trail.add(12345, 255)

      var index = []
      var count = []
      function decode(idx, cnt) {
        index.push(idx)
        count.push(cnt)
      }

      trail.tick(decode)

      assert.deepEqual(index, [8, 12345])
      assert.deepEqual(count, [5, 255])
    })

  })

  suite('tick', function() {

    test('count is decremented when using tick', function() {
      var trail = new Trail(10)
      trail.add(10, 4)
      trail.add(11, 2)
      trail.add(12, 3)

      var count = []
      function decode(idx, cnt) {
        count.push(cnt)
      }

      var expected = [
        [4, 2, 3],
        [3, 1, 2],
        [2, 1],
        [1],
        [],
        [],
      ]

      for (var i=0; i<expected.length; i++) {
        var count = []
        trail.tick(decode)
        assert.deepEqual(count, expected[i])
      }
    })

  })

});