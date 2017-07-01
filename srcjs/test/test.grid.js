var assert = chai.assert;

suite('Grid', function() {

  suite('activate', function() {
    var grid = new Grid(3, 3)

    test('x,y position for non-activated cells', function() {
      assert.equal(grid.cell(0, 0), false)
      assert.equal(grid.cell(2, 2), false)
    })

    test('x,y position for activated but uncommitted cells', function() {
      grid.activate(1, 2)
      grid.activate(2, 1)

      assert.equal(grid.cell(1, 2), false)
      assert.equal(grid.cell(2, 1), false)
    })

    test('x,y position for activated and committed cells', function() {
      grid.activate(1, 2)
      grid.activate(2, 1)
      grid.commit()

      assert.equal(grid.cell(1, 2), true)
      assert.equal(grid.cell(2, 1), true)
    })
  })

});
