var assert = chai.assert;

suite('FlipSet', function() {

  suite('add', function() {

    test('only add items once', function() {
      var set = new FlipSet(10)

      set.add(1)
      set.add(2)
      set.add(2)
      set.add(3)
      set.add(3)

      assert.equal(set.array.writeSize, 3)
      assert.equal(set.array.write[0], 1)
      assert.equal(set.array.write[1], 2)
      assert.equal(set.array.write[2], 3)
    })

  })

});
