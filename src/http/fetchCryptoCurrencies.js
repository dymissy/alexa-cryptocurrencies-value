const axios = require('axios');
const CryptoCurrency = require('../model/cryptoCurrency')

const API_BASE_URL = 'https://api.coincap.io/v2';

module.exports = async () => {
    const [assetResponse, rateResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/assets/?limit=15`),
        axios.get(`${API_BASE_URL}/rates/euro`)
    ]);

    let cryptoCurrencies = [];
    assetResponse.data.data.forEach((item) => {
        cryptoCurrencies.push(CryptoCurrency.create(item, rateResponse.data.data.rateUsd))
    });

    return cryptoCurrencies;
}
