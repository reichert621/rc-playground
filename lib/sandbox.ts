import express from 'express';
const app = express();

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
        throw new Error('Cannot divide by zero');
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

app.use(express.json());

app.post('/add', (req, res) => {
    const { a, b } = req.body;
    res.json({ result: add(a, b) });
});

app.post('/subtract', (req, res) => {
    const { a, b } = req.body;
    res.json({ result: subtract(a, b) });
});

app.post('/multiply', (req, res) => {
    const { a, b } = req.body;
    res.json({ result: multiply(a, b) });
});

app.post('/divide', (req, res) => {
    try {
        const { a, b } = req.body;
        res.json({ result: divide(a, b) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/areaOfCircle', (req, res) => {
    const { radius } = req.body;
    res.json({ result: areaOfCircle(radius) });
});

app.post('/areaOfRectangle', (req, res) => {
    const { length, width } = req.body;
    res.json({ result: areaOfRectangle(length, width) });
});

app.post('/areaOfTriangle', (req, res) => {
    const { base, height } = req.body;
    res.json({ result: areaOfTriangle(base, height) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
