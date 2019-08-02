export const shouldLoadSubdomain = () => {
    const subdomain = window.location.hostname.split('.')[0];
    return subdomain === 'app';
}