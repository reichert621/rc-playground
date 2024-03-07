export function greet(): string {
    return "Hello, world!";
}

class Calculator {
    /**
     * Adds two numbers together.
     */
    add(numbers: number[]): number {
        return numbers.reduce((a, b) => a + b, 0);
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




    exponent(base: number, exponent: number): number {
        return Math.pow(base, exponent);
    }

    squareRoot(number: number): number {
        if (number < 0) {
            throw new Error("Cannot calculate square root of a negative number");
        }
        return Math.sqrt(number);
    }

}
