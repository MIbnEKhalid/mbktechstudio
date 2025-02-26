const Web3Forms_API_KEY_Private = 'd2837145-a5b5-49af-b269-cb79e9b57456';

// Function to check if the domain is allowed
const isAllowedDomain = (domain) => {
    return (
        domain === 'mbktechstudio.com' ||
        domain === 'mbktech.xyz' ||
        domain === 'ibnekhalid.me' ||
        domain.endsWith('.mbktechstudio.com') ||
        domain.endsWith('.mbktech.xyz') ||
        domain.endsWith('.ibnekhalid.me')
        /*  
            || domain === 'localhost' ||
            domain === '127.0.0.1'
        */
    );
};

const currentDomain = window.location.hostname;

let apiKey_access_key = 'd2837145-a5b5-49af-b269-cb79e9b57456';
let restriction_enabled = false;
if (isAllowedDomain(currentDomain) || !restriction_enabled) {
    apiKey_access_key = Web3Forms_API_KEY_Private;
} else {
    console.warn('Unauthorized domain:', currentDomain);
    apiKey_access_key = null;
}