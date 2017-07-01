var assert = chai.assert;

suite('FlipArray', function() {

  suite('activate', function() {

    test('adding element', function() {
      var array = FlipArray.create(10)

      array.add(42)

      assert.equal(array.write[0], 42)
      assert.equal(array.writeSize, 1)
    })

    test('flip', function() {
      var array = FlipArray.create(10)
      array.add(10)
      array.add(20)

      array.flip()

      assert.equal(array.writeSize, 0)

      assert.equal(array.read[0], 10)
      assert.equal(array.read[1], 20)
      assert.equal(array.readSize, 2)
    })

    test('flip, second time', function() {
      var array = FlipArray.create(10)
      array.add(10)
      array.add(20)
      array.flip()
      array.add(30)
      array.add(40)
      array.add(50)
      array.flip()

      assert.equal(array.write[0], 10)
      assert.equal(array.write[1], 20)
      assert.equal(array.writeSize, 2)

      assert.equal(array.read[0], 30)
      assert.equal(array.read[1], 40)
      assert.equal(array.read[2], 50)
      assert.equal(array.readSize, 3)
    })

    test('reset', function() {
      var array = FlipArray.create(10)
      array.add(10)
      array.add(20)
      array.reset()

      assert.equal(array.write[0], 10)
      assert.equal(array.write[1], 20)
      assert.equal(array.writeSize, 0)
    })

  })

});
