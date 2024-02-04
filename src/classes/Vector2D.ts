export default class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    set(Vector: Vector2D | {x: number, y: number}) {
        this.x = Vector.x;
        this.y = Vector.y;
    }

    // Addition of two vectors
    add(vector: Vector2D): Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    // Subtraction of two vectors
    subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    // Scalar multiplication
    multiply(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    // Scalar division
    divide(scalar: number): Vector2D {
        if (scalar !== 0) {
            return new Vector2D(this.x / scalar, this.y / scalar);
        } else {
            return new Vector2D(0, 0);
        }
    }

    // Dot product of two vectors
    dot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    // Magnitude (length) of the vector
    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // Normalize the vector (make it a unit vector)
    normalize(): Vector2D {
        const mag = this.magnitude();
        if (mag !== 0) {
            return this.divide(mag);
        } else {
            return new Vector2D(0, 0);
        }
    }
}


export class Vector3D extends Vector2D {
    public z: number;
    constructor(x: number, y: number, z: number) {
        super(x, y);
        this.z = z;
    }
}