module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/banano-stats/'
        : '/'
}