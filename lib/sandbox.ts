function add(a: number, b: number): number {
    return a + b;
}

function subtract(a: number, b: number): number {
    return a - b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

function areaOfCircle(radius: number): number {
    return Math.PI * radius * radius;
}

function areaOfRectangle(length: number, width: number): number {
    return length * width;
}

function areaOfTriangle(base: number, height: number): number {
    return 0.5 * base * height;
}
