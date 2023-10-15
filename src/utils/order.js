export function asc(arr) {
    return arr.sort((a, b) => {
        const numA = getNumberFromText(a);
        const numB = getNumberFromText(b);
        return numA - numB;
    });
}

function getNumberFromText(string) {
    const match = string.match(/(\d+)/);
    if (match) {
        return parseInt(match[0], 10);
    }
    return NaN;
}