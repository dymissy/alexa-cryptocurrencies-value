module.exports = class CryptoCurrency {
  constructor (id, rank, symbol, name, priceUsd, priceEur, changePercent24Hr) {
      this._id = id;
      this._rank = rank;
      this._symbol = symbol;
      this._name = name;
      this._priceUsd = parseFloat(priceUsd);
      this._priceEur = parseFloat(priceEur);
      this._changePercent24Hr = parseFloat(changePercent24Hr);
  }

  get id() {
      return this._id
  }

  get rank() {
      return this._rank
  }

  get name() {
      return this._name
  }

  get symbol() {
      return this._symbol
  }

  get priceUsd() {
      return this._priceUsd.toFixed(2)
  }

  get priceEur() {
      if (this._priceEur > 0 && this._priceEur < 1) {
          return this._priceEur.toFixed(5)
      }

      return this._priceEur.toFixed(2)
  }

  get changePercent24Hr() {
      return this._changePercent24Hr.toFixed(2)
  }

  static create (data, rate) {
    const { id, rank, symbol, name, priceUsd, changePercent24Hr } = data;

    const priceEur = parseFloat(priceUsd) / parseFloat(rate);

    return new CryptoCurrency(
        id,
        rank,
        symbol,
        name,
        priceUsd,
        priceEur,
        changePercent24Hr
    );
  }
}
