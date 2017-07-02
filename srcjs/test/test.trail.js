var assert = chai.assert;

suite('Trail', function() {

  suite('mutatation', function() {

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

    test('refreshing a cell sets it to initial count', function() {
      var trail = new Trail(10)
      trail.refresh(1)
      trail.refresh(2)

      var index = []
      var count = []
      function decode(idx, cnt) {
        index.push(idx)
        count.push(cnt)
      }

      trail.tick(decode)

      assert.deepEqual(index, [1, 2])
      assert.deepEqual(count, [trail.initialCount, trail.initialCount])
    })

    test('removing a cell zeros count', function() {
      var trail = new Trail(10)
      trail.refresh(1)
      trail.refresh(2)
      trail.refresh(3)
      trail.remove(2)

      var index = []
      var count = []
      function decode(idx, cnt) {
        index.push(idx)
        count.push(cnt)
      }

      trail.tick(decode)

      assert.deepEqual(index, [1, 3])
      assert.deepEqual(count, [trail.initialCount, trail.initialCount])
    })

  })

  suite('tick', function() {

    test('count is decremented when using tick', function() {
      var trail = new Trail(10)
      trail.step = 1
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
