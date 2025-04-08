const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const backend = (path: string) => {
    return `${backendUrl}${path}`;
}