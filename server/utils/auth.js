require('dotenv').config();

const axios = require('axios');
const tough = require('tough-cookie');

const axiosCookieJarSupport = require('axios-cookiejar-support').wrapper; // Import the support for axios
axiosCookieJarSupport(axios);

// Mock function to simulate the provider settings function
function getSettingsFromProvider(slug) {
    // For this example, we're returning the provider settings for 'zr_express_new'
    const providers = {
        'zr_express_new': {
            slug: 'zr_express_new',
            login_url: 'https://procolis.com/PROCLIENT_WEB/FR/Connexion/ZREXPRESS.awp',
            extra: {
                context: 'A4',
                pa3: '1'
            }
        }
    };
    return providers[slug] || null;
}
// Mock function to simulate getting options and logging

exports.auth = async (providerSlug) =>  {
    try {
        // Get the provider settings dynamically
        const provider = getSettingsFromProvider(providerSlug);
        if (!provider) {
            throw new Error('Provider not found');
        }
        const jar = new tough.CookieJar();

        // Create an axios instance with the cookie jar
        const client = axios.create({
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Prepare the form data for the request
        const formParams = new URLSearchParams();
        formParams.append('WD_ACTION_', 'AJAXEXECUTE');
        formParams.append('EXECUTEPROCCHAMPS', 'ServeurAPI.API_Connecte');
        formParams.append('WD_CONTEXTE_', provider.extra.context);
        formParams.append('PA1', process.env.EXPRESS_USERNAME);
        formParams.append('PA2', process.env.EXPRESS_PASSWORD);
        formParams.append('PA3', provider.extra.pa3);

        // Send the POST request
        const response = await client.post(provider.login_url, formParams.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            jar: jar,  // Attach cookie jar
            withCredentials: true,  // Ensure cookies are sent
        });

        if (response.status === 200) {
            return jar; // Return the cookie jar containing the session cookies
        } else {
            throw new Error('Failed to authenticate');
        }
    } catch (error) {
  
        throw error;
    }
}


