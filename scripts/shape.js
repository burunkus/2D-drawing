class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isValid() {
        if (this.x < minXValues)
            return false;
        if (this.x > maxXValues)
            return false;
        if (this.y < minYValues)
            return false;
        if (this.y > maxYValues)
            return false;
        return true;
    }
}

class Edge {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        this.distance = this.calculateDistance();
        this.slopeY = (this.point2.y - this.point1.y);
        this.slopeX = (this.point2.x - this.point1.x);
    }

    calculateDistance() {
        //use the pythagoras theorem to find the distance(hypothenus) between two points
        let dx = this.point2.x - this.point1.x;
        let dy = this.point2.y - this.point1.y;
        return Math.hypot(dx, dy);
    }
}

class Shape {
    constructor() {
        this.points = [];
        this.edges = [];
    }

    allPointsValid() {
        for(var index = 0; index < this.points.length; index++) {
            var point = new Point(this.points[index].x, this.points[index].y);
            if(!point.isValid()) {
                return {
                    is_valid: false,
                    status: "error",
                    errorType: "Range Error",
                    message: `Point ${index + 1}: X: ${this.points[index].x}, should be less than 800 and Y: ${this.points[index].y} less than 900.`
                };
            }
        }

        for(var index1 = 0; index1 < this.points.length; index1++){
            for(var index2 = index1+1; index2 < this.points.length; index2++){
                var point1 = this.points[index1];
                var point2 = this.points[index2];
                if(point1.x == point2.x && point1.y == point2.y) {
                    return {
                        is_valid: false,
                        status: "error",
                        errorType: "Same point Error",
                        message: `No two points should have the same X and Y values. Check points ${index + 1} and ${index2 + 1}`
                    };
                }

            }
        }
        return {
            is_valid: true
        };
    }

    get getEdges() {
        var edges = [];
        for (var point1 = 0; point1 < this.pointCount; point1++) {
            var point2 = point1 != this.pointCount - 1 ? point1 + 1 : 0;
            edges.push(new Edge(this.points[point1], this.points[point2]));
        }
        return edges;
    }

    edgesDifferentSlopes() {
        for(var index = 0; index < this.edges.length; index++){
            var edge1 = this.edges[index];
            var edge2 = index == this.edges.length-1 ? this.edges[0] : this.edges[index+1];

            if(edge1.slopeX == edge2.slopeX && edge1.slopeY == edge2.slopeY) {
                return {
                    is_valid: false,
                    status: "error",
                    errorType: "Same slope",
                    message: `The slopes of points (${this.edges[edge1].point1.x}, ${this.edges[edge1].point1.y}) (${this.edges[edge1].point2.x}, ${this.edges[edge1].point2.y}) and (${this.edges[edge2].point1.x}, ${this.edges[edge2].point1.y}) (${this.edges[edge2].point2.x}, ${this.edges[edge2].point2.y}) are the same`
                };
            }
        }
        return {
            is_valid: true
        };
    }

    onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
            return true;
        return false;
    }

    orientation(p, q, r) {
        var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val == 0)
            return 0;
        return (val > 0) ? 1 : 2;
    }

    doIntersect(p1, q1, p2, q2) {
        var o1 = this.orientation(p1, q1, p2);
        var o2 = this.orientation(p1, q1, q2);
        var o3 = this.orientation(p2, q2, p1);
        var o4 = this.orientation(p2, q2, q1);
        if (o1 != o2 && o3 != o4)
            return true;
        if (o1 == 0 && this.onSegment(p1, p2, q1))
            return true;
        if (o2 == 0 && this.onSegment(p1, q2, q1))
            return true;
        if (o3 == 0 && this.onSegment(p2, p1, q2))
            return true;
        if (o4 == 0 && this.onSegment(p2, q1, q2))
            return true;
        return false;
    }

    containsIntersectingPoints() {
        if (this.pointCount <= 3) {
            return {
                is_valid: false
            };
        }

        var maxComparisions = this.points.length - 3;
        for (var edge1 = 0; edge1 < this.edges.length; edge1++){
            var comparisionsMade = 0;
            for (var edge2 = edge1+2; edge2 < this.edges.length; edge2++){
                if (this.doIntersect(this.edges[edge1].point1, this.edges[edge1].point2,
                    this.edges[edge2].point1, this.edges[edge2].point2)) {
                    return {
                        is_valid: true,
                        status: "error",
                        errorType: "Intersection error",
                        message: `Points (${this.edges[edge1].point1.x}, ${this.edges[edge1].point1.y}) (${this.edges[edge1].point2.x}, ${this.edges[edge1].point2.y}) and (${this.edges[edge2].point1.x}, ${this.edges[edge2].point1.y}) (${this.edges[edge2].point2.x}, ${this.edges[edge2].point2.y}) intersects`
                    };
                }
                if(++comparisionsMade == maxComparisions)
                    break;
            }
        }
        return {
            is_valid: false
        };
    }

    isValid() {
        var check = this.allPointsValid();
        if(check.is_valid) {
            this.edges = this.getEdges;
        } else return check;
        check = this.edgesDifferentSlopes();
        if(!check.is_valid)
            return check;
        check = this.containsIntersectingPoints();
        if (check.is_valid)
            return check;
        return {
            is_valid: true
        };
    }

    static calculateDistance(shape1, shape2) {
        console.log(shape1);
        console.log(shape2);
        let allDistances = [];
        const sizeOfShape1 = shape1.pointCount;
        const sizeOfShape2 = shape2.pointCount;
        for(let point1 = 0; point1 < sizeOfShape1; point1++) {
            for(let point2 = 0; point2 < sizeOfShape2; point2++) {
                allDistances.push(new Edge(shape1.points[point1], shape2.points[point2]));
            }
        }
        allDistances.sort(function(a, b) {
            return a.distance - b.distance;
        });
        console.log(allDistances);
        return allDistances[0];

    }

    removePoint() {
        this.points.pop();
    }
    addPoint() {
        this.points.push(new Point(-1, -1));
    }
    get pointCount() {
        return this.points.length;
    }
    editPointX(index, value) {
        this.points[index].x = value;
    }
    editPointY(index, value) {
        this.points[index].y = value;
    }
    getPointX(index) {
        return this.points[index].x;
    }
    getPointY(index) {
        return this.points[index].y;
    }
    toString() {
        return this.points.toString();
    }
}
