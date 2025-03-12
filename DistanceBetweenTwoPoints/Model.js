// Model.js
class PointModel {
    constructor() {
        this.points = [];
        this.selectedPoints = [];
        this.maxPoints = 4;
        this.formulaValues = {
            d: null,
            dx: null,
            dy: null
        };
    }

    addPoint(x, y) {
        if (this.points.length < this.maxPoints) {
            const gridX = Math.round(x);
            const gridY = Math.round(y);
            
            // Check if point already exists
            for (const point of this.points) {
                if (point.x === gridX && point.y === gridY) {
                    return null;
                }
            }
            
            const point = { x: gridX, y: gridY, id: Date.now() };
            this.points.push(point);
            return point;
        }
        return null;
    }

    selectPoint(id) {
        const point = this.points.find(p => p.id === id);
        if (point) {
            if (this.selectedPoints.length < 2) {
                if (!this.selectedPoints.includes(point)) {
                    this.selectedPoints.push(point);
                    return true;
                }
            } else if (this.selectedPoints.includes(point)) {
                this.selectedPoints = this.selectedPoints.filter(p => p !== point);
                return true;
            }
        }
        return false;
    }

    getDistance() {
        if (this.selectedPoints.length === 2) {
            const [pointA, pointB] = this.selectedPoints;
            const dx = pointB.x - pointA.x;
            const dy = pointB.y - pointA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Update formula values
            this.formulaValues = {
                d: distance,
                dx: dx,
                dy: dy
            };
            
            return {
                dx,
                dy,
                distance
            };
        }
        return null;
    }

    getRightTrianglePoint() {
        if (this.selectedPoints.length === 2) {
            const [pointA, pointB] = this.selectedPoints;
            return { x: pointB.x, y: pointA.y };
        }
        return null;
    }

    reset() {
        this.points = [];
        this.selectedPoints = [];
        this.formulaValues = {
            d: null,
            dx: null,
            dy: null
        };
    }

    generateRandomPoints() {
        this.reset();
        for (let i = 0; i < 4; i++) {
            const x = Math.floor(Math.random() * 17) - 8; // -8 to 8
            const y = Math.floor(Math.random() * 17) - 8; // -8 to 8
            this.addPoint(x, y);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { PointModel };
}