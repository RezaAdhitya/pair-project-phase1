function convertRp(money) {
  return money.toLocaleString("id-ID", {style:"currency", currency:"IDR"});
}

module.exports = { convertRp }