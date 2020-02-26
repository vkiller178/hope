module.exports = {
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    config.plugins.push(
      new webpack.DefinePlugin({
        window: 'window',
      })
    )

    return config
  },
}
