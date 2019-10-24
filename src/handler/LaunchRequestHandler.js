const Alexa = require('ask-sdk-core');

const { supportsAPL, formatDate } = require('../../util');
const fetchCryptoCurrencies = require('../http/fetchCryptoCurrencies');
const ListItem = require('../model/listItem');
const CryptoCurrenciesDocument = require('../../apl/cryptocurrencies.json');
const datasources = require('../../apl/cryptocurrencies-datasources.json');

let welcomeOutput = "Benvenuto in Valore Cripto Valute. Di quale cripto valuta vuoi sapere il valore?";
let welcomeReprompt = "Di quale cripto valuta vuoi sapere il valore?";

module.exports = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        if (!supportsAPL(handlerInput)) {
            return handlerInput.responseBuilder
                .speak(welcomeOutput)
                .reprompt(welcomeReprompt)
                .getResponse();
        }

        const cryptoCurrencies = await fetchCryptoCurrencies()

        return handlerInput.responseBuilder
            .speak(welcomeOutput)
            .reprompt(welcomeReprompt)
                .addDirective({
                    type : 'Alexa.Presentation.APL.RenderDocument',
                    document : CryptoCurrenciesDocument,
                    datasources : parseDatasources(datasources, cryptoCurrencies)
                })
            .getResponse();
    }
};


const parseDatasources = (datasources, cryptoCurrencies) => {
    datasources.listTemplate1Metadata.lastUpdate = formatDate(new Date());
    datasources.listTemplate1ListData.listPage.listItems = cryptoCurrencies.map(cryptoCurrency =>
        (ListItem.fromCryptoCurrency(cryptoCurrency)).toAPLObject()
    )

    return datasources;
}
