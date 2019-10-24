const BUCKET_ICONS = 'https://dymissy-criptocurrencies.s3.eu-central-1.amazonaws.com/icons';

module.exports = class ListItem {
    constructor(id, rank, name, symbol, priceEur, changePercent24Hr) {
        this.id = id;
        this.rank = rank;
        this.name = name;
        this.symbol = symbol;
        this.priceEur = priceEur;
        this.changePercent24Hr = changePercent24Hr;
    }

    toAPLObject() {
        return {
        	"listItemIdentifier": this.id,
        	"ordinalNumber": this.rank,
        	"textContent": {
        		"name": {
        			"type": "PlainText",
        			"text": this.name
        		},
        		"symbol": {
        			"type": "PlainText",
        			"text": this.symbol
        		},
        		"priceEur": {
        			"type": "PlainText",
        			"text": this.priceEur
        		},
        		"changePercent24Hr": {
        			"type": "PlainText",
        			"text": this.changePercent24Hr,
        			"color": this.changePercent24Hr > 0 ? "green" : "red"
        		}
        	},
        	"image": {
        		"contentDescription": null,
        		"smallSourceUrl": null,
        		"largeSourceUrl": null,
        		"sources": [{
        				"url": `${BUCKET_ICONS}/${this.symbol.toLowerCase()}.png`,
        				"size": "small",
        				"widthPixels": 0,
        				"heightPixels": 0
        			},
        			{
        				"url": `${BUCKET_ICONS}/${this.symbol.toLowerCase()}.png`,
        				"size": "large",
        				"widthPixels": 0,
        				"heightPixels": 0
        			}
        		]
        	},
        	"token": this.id
        }
    }

    static fromCryptoCurrency(cryptoCurrency) {
        return new ListItem(
            cryptoCurrency.id,
            cryptoCurrency.rank,
            cryptoCurrency.name,
            cryptoCurrency.symbol,
            cryptoCurrency.priceEur,
            cryptoCurrency.changePercent24Hr
        )
    }
}
