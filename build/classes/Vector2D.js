"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3D = void 0;
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // Addition of two vectors
    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }
    // Subtraction of two vectors
    subtract(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }
    // Scalar multiplication
    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    // Scalar division
    divide(scalar) {
        if (scalar !== 0) {
            return new Vector2D(this.x / scalar, this.y / scalar);
        }
        else {
            return new Vector2D(0, 0);
        }
    }
    // Dot product of two vectors
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    // Magnitude (length) of the vector
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    // Normalize the vector (make it a unit vector)
    normalize() {
        const mag = this.magnitude();
        if (mag !== 0) {
            return this.divide(mag);
        }
        else {
            return new Vector2D(0, 0);
        }
    }
}
exports.default = Vector2D;
class Vector3D extends Vector2D {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }
}
exports.Vector3D = Vector3D;
