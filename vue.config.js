module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/apps/onlineprd/dist/'
    : '/',
  css: {
    sourceMap: true
  }
}
