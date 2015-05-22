function Cell(nodeId,owner, position, mass, type) {
    this.nodeId = nodeId;
    this.owner = owner; // playerTracker that owns this cell
    this.color = {r: 0, g: 255, b: 0};
    this.position = position;
    this.size = 0; // Radius of the cell - Depreciated, use getSize() instead
    this.mass = mass; // Starting mass of the cell
    this.speed = 30; // Filler, will be changed later
    this.cellType = type; // 0 = Player Cell, 1 = Food, 2 = Virus, 3 = Ejected Mass
    this.recombineTicks = 1; // Ticks until the cell can recombine with other cells 
    
    this.moveEngineTicks = 0; // Amount of times to loop the movement function
    this.moveEngineSpeed = 0;
    this.direction = 0; // Angle of movement
}

module.exports = Cell;

Cell.prototype.getName = function() {
	if (this.owner) {
		return this.owner.name;
	} else {
		return "";
	}
}

Cell.prototype.getType = function() {
    return this.cellType;
}

Cell.prototype.getPos = function() {
    return this.position;
}

Cell.prototype.getSize = function() {
    return Math.sqrt(100 * this.mass) + 1;
}

Cell.prototype.getMass = function() {
    return this.mass;
}

Cell.prototype.setMass = function(n) {
    this.mass = n;
}

Cell.prototype.getOwner = function() {
    return this.owner;
}

Cell.prototype.setAngle = function(radians) {
    this.direction = radians;
}

Cell.prototype.setMoveEngineData = function(speed, ticks) {
    this.moveEngineSpeed = speed;
    this.moveEngineTicks = ticks;
}

Cell.prototype.getMoveTicks = function() {
    return this.moveEngineTicks;
}

// Functions

Cell.prototype.calcMove = function(x2, y2, border) {
    var x1 = this.position.x;
    var y1 = this.position.y;
    
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    var dist = this.speed;
    
    while (!((x1 == x2) && (y1 == y2)) && (dist > 0)) {
        var e2 = err << 1;
        if (e2 > -dy){
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        dist--;
    }
    
    // Check to ensure we're not passing the world border
    if (x1 < border.left || x1 > border.right || y1 < border.top || y1 > border.bottom) {
        return;
    }
	
	// Collision check for other cells (Broken)
	/*
	for (var i = 0; i < this.owner.cells.length;i++) {
		var cell = this.owner.cells[i];
		
		if (this.nodeId == cell.nodeId) {
			continue;
		}
		
		if (cell.recombineTicks > 0) {
			// Cannot recombine
			var xs = Math.pow(cell.position.x - this.position.x, 2);
			var ys = Math.pow(cell.position.y - this.position.y, 2);
			var dist = Math.sqrt( xs + ys );
			var collisionDist = cell.getSize() + this.getSize();
			
			// Caculations
			if (dist < collisionDist) {
				// Collided
				return;
			}
		}
	}
	*/

    this.position.x = x1;
    this.position.y = y1;
}

Cell.prototype.calcMovePhys = function() {
	//Movement for ejected cells
	var X = this.position.x + ( this.moveEngineSpeed * Math.sin(this.direction) );
	var Y = this.position.y + ( this.moveEngineSpeed * Math.cos(this.direction) );
	
    this.position.x = X;
    this.position.y = Y;
    
    //
    this.moveEngineSpeed *= .8;
    this.moveEngineTicks -= 1;
}
