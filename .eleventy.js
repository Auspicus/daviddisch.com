const eleventyNavigationPlugin = require("@11ty/eleventy-navigation")
const CleanCSS = require('clean-css')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('img')
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPlugin(eleventyNavigationPlugin)
  eleventyConfig.addFilter('cssmin', (code) => {
    return new CleanCSS({
      level: {
        1: { specialComments: 'none' },
        2: { all: true }
      }
    }).minify(code).styles;
  })

  return {
    passthroughFileCopy: true
  }
}