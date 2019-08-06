export const shouldLoadSubdomain = () => {
    const validSubdomains = {
        'app': true,
        'localhost': true,
        'app-pre': true
    }
    const subdomain = window.location.hostname.split('.')[0];
    return validSubdomains[subdomain]? false : true;
}