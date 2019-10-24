const axios = require('axios');
const CryptoCurrency = require('../model/cryptoCurrency')

const API_BASE_URL = 'https://api.coincap.io/v2';

module.exports = async (id) => {
    const [assetResponse, rateResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/assets/${id}`),
        axios.get(`${API_BASE_URL}/rates/euro`)
    ]);

    return CryptoCurrency.create(assetResponse.data.data, rateResponse.data.data.rateUsd);
}
