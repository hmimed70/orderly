/*const  axios =  require('axios');

const getToken = async () => {
  try {
    const response = await axios.get('https://procolis.com/api_v1/token', {
      headers: {
        'token': 'ff1a82004fc1f7851bb423970bc3045248eadac93d9bc7b851255413f180b62a',
        'key': '03ac49275e2f44e384dab00294f6b4a3',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Erreur lors de la requête :', error);
  }
};

getToken();
*/

const data = require('./data.json');

data.Colis.map(colis => {
  console.log(colis.Situation, colis.IDSituation);
});