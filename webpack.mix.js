const mix = require("laravel-mix");
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .ts("resources/ts/app.tsx", "public/js")
  .react()
  .postCss("resources/css/app.css", "public/css", [require("tailwindcss")])
  .webpackConfig({
    output: {
      chunkFilename: "js/[name].js?id=[chunkhash]",
    },
  })
  .setResourceRoot("/")
  .browserSync("127.0.0.1")
  .disableNotifications()
  .alias({
    "@context": path.join(__dirname, "resources/ts/context"),
    "@pages": path.join(__dirname, "resources/ts/pages"),
    "@shared": path.join(__dirname, "resources/ts/shared"),
  });

if (mix.inProduction()) {
  const ASSET_URL = process.env.ASSET_URL + "/";

  mix
    .webpackConfig((webpack) => {
      return {
        plugins: [
          new webpack.DefinePlugin({
            "process.env.ASSET_PATH": JSON.stringify(ASSET_URL),
          }),
        ],
        output: {
          publicPath: ASSET_URL,
        },
      };
    })
    .options({
      terser: {
        extractComments: false,
      },
    })
    .version();
}
