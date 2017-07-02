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

  suite('trail', function() {
    var g = function() { }
    var alive = 'rgb(0, 255, 0)'
    var dead = 'rgb(64, 64, 64)'
    var trail0 = 'rgb(0, 0, 250)'
    var trail1 = 'rgb(0, 0, 240)'

    test('grid is drawn with trail after cell dies', function() {
      var grid = new Grid(1, 1)
      var colours = []
      grid.drawCell = function(index, colour, g, scale) {
        colours.push(colour)
      }

      grid.activate(1, 1)
      grid.commit()
      grid.draw(g, 1)

      grid.tick()
      grid.draw(g, 1)// dead + trail0
      grid.tick()
      grid.draw(g, 1)

      assert.sameMembers(colours, [alive, dead, trail0, trail1])
    })

    test('grid with cell alive stays green', function() {
      var grid = new Grid(2, 2)
      var colours = []
      grid.drawCell = function(index, colour, g, scale) {
        colours.push(index + colour)
      }

      grid.activate(1, 1)
      grid.activate(1, 2)
      grid.activate(2, 1)
      grid.activate(2, 2)
      grid.commit()
      grid.draw(g, 1)

      grid.tick()
      grid.draw(g, 1)
      // Will cause no changes
      grid.tick()
      grid.draw(g, 1)
      grid.tick()
      grid.draw(g, 1)

      assert.sameMembers(colours, [0+alive, 1+alive, 2+alive, 3+alive])
    })

    test('trail shown at one tick after initial blinker', function() {
      var grid = new Grid(3, 3)
      var colours = []
      grid.drawCell = function(index, colour, g, scale) {
        colours.push(index + colour)
      }

      // Blinker state: ---
      grid.activate(1, 2)
      grid.activate(2, 2)
      grid.activate(3, 2)
      grid.commit()
      grid.draw(g, 1)
      colours = []

      // Blinker state: |
      grid.tick()
      grid.draw(g, 1)

      // Note, only draws differences, no need to redraw (2,2)
      assert.sameMembers(colours, [
        1+alive, // (2,1)
        7+alive, // (2,3)
        3+dead,  // (1,2)
        3+trail0,  // (1,2)
        5+dead,  // (3,2)
        5+trail0,  // (3,2)
      ])
    })

  })

});
