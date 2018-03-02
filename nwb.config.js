module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'roundy',
      externals: {
        react: 'React'
      }
    }
  }
}
