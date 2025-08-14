export default function debounce<T extends unknown[]>(func: (...args: T) => void, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return async function executedFunction(...args: T) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}