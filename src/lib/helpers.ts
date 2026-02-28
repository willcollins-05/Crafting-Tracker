

export function formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
}

export function formatPercentageCapped(value: number): string {
    if (value >= 1) {
        return '100%';
    }
    return formatPercentage(value);
}


