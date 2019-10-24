const Alexa = require('ask-sdk-core');

const { supportsAPL } = require('../../util')
const cryptoCurrencyCurrentValue = require('../http/fetchCryptoCurrency');
const CryptoCurrencyDocument = require('../../apl/cryptocurrency.json')
const datasources = require('../../apl/cryptocurrency-datasources.json')

const CRYPTOCURRENCY_MATCHED = 'ER_SUCCESS_MATCH';
const CRYPTOCURRENCY_NOT_MATCHED = 'ER_SUCCESS_NO_MATCH';
const BUCKET_ICONS = 'https://dymissy-criptocurrencies.s3.eu-central-1.amazonaws.com/icons';

let speakOutput = `Il valore del [NAME] è di [VALUE] euro`;

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CryptoCurrencyIntent';
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const currencyProvided = Alexa.getSlotValue(handlerInput.requestEnvelope, 'cryptocurrency');

        if (request.intent.slots.cryptocurrency.resolutions.resolutionsPerAuthority[0].status.code === CRYPTOCURRENCY_NOT_MATCHED) {
            return handlerInput.responseBuilder
                .speak(`La cripto valuta ${currencyProvided} non è supportata ancora. Prova con un'altra cripto valuta.`)
                .getResponse();
        }

        const { name, id } = request.intent.slots.cryptocurrency.resolutions.resolutionsPerAuthority[0].values[0].value
        const cryptoCurrency = await cryptoCurrencyCurrentValue(id);

        if (supportsAPL(handlerInput)) {
            return handlerInput.responseBuilder
                .speak(speakOutput.replace('[NAME]', name).replace('[VALUE]', cryptoCurrency.priceEur))
                .addDirective({
                  type : 'Alexa.Presentation.APL.RenderDocument',
                  document : CryptoCurrencyDocument,
                  datasources : parseDatasources(datasources, cryptoCurrency)
                })
                .getResponse();
        }

        return handlerInput.responseBuilder
            .speak(speakOutput.replace('[NAME]', name).replace('[VALUE]', cryptoCurrency.priceEur))
            .getResponse();
    }
};


const parseDatasources = (datasources, cryptoCurrency) => {
    datasources.bodyTemplate3Data.image.sources[0].url = `${BUCKET_ICONS}/${(cryptoCurrency.symbol).toLowerCase()}.png`;
    datasources.bodyTemplate3Data.image.sources[1].url = `${BUCKET_ICONS}/${(cryptoCurrency.symbol).toLowerCase()}.png`;
    datasources.bodyTemplate3Data.textContent.title.text = cryptoCurrency.name;
    datasources.bodyTemplate3Data.textContent.subtitle.text = cryptoCurrency.symbol;
    datasources.bodyTemplate3Data.textContent.currencyValue.text = cryptoCurrency.priceEur;
    datasources.bodyTemplate3Data.textContent.changePercent24Hr.text = cryptoCurrency.changePercent24Hr;
    datasources.bodyTemplate3Data.textContent.changePercent24Hr.color = cryptoCurrency.changePercent24Hr > 0 ? 'green' : 'red';

    return datasources;
}
