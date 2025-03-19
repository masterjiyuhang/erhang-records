const url = new URL(
  'http://localhost:8085/?exchange=cdaacecb-56d0-4732-8ae3-263a6175bcd1&redirectFrom=ERA'
)

const exchange = url.searchParams.get('exchange')
console.log('🍉 ~ test.js:6 ~ exchange:', exchange)
