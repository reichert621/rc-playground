class Calculator {
    /**
     * Adds two numbers together.
     */
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }

    multiply(a: number, b: number): number {
        return a * b;
    }

    divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    }

    areaOfCircle(radius: number): number {
        return Math.PI * radius * radius;
    }

    areaOfRectangle(length: number, width: number): number {
        return length * width;
    }

    areaOfTriangle(base: number, height: number): number {
        return 0.5 * base * height;
    }
}
