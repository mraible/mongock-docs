const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItToc = require('markdown-it-table-of-contents')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const PROFESSIONAL_SPAN_LABEL = "<span class=\"professional\">";
const PROFESSIONAL_A_LABEL = '<a href="/professional">';
const headerSlugify = (input) => {


  const indexSpan = input.indexOf(PROFESSIONAL_SPAN_LABEL);
  const indexA = input.indexOf(PROFESSIONAL_A_LABEL);
  let index;
  let endToken;
  let length;
  if (indexA > 0 && indexA < indexSpan ) {
    index = indexA;
    endToken = '</a>';
    length = PROFESSIONAL_A_LABEL.length;
    if(indexSpan > 0) {
      length+= PROFESSIONAL_SPAN_LABEL.length;
      endToken = "</span>";
    }
  } else {
    index = indexSpan;
    endToken = "</span>";
    length = PROFESSIONAL_SPAN_LABEL.length;
    if(indexA > 0) {
      length+= PROFESSIONAL_A_LABEL.length;
      endToken = "</a>";
    }
  }

  let text = input;
  if(index > 0) {
    const firstPart = input.substring(0, index)
    const secondPart = input.substring(index + length, input.indexOf(endToken))
    text =  firstPart+secondPart
console.log("-------------------------------------------------")
console.log("INPUT: " + input)
    console.log("FIRST: " + firstPart)
    console.log("SECOND: " + secondPart)
    console.log("TEXT: " + text)
console.log("-------------------------------------------------")
  }
   
  const cleaned = text.replace(/<\/?code>/g, '').replace(/(&lt;|&gt;|[<>])/g, '')
  return markdownItAnchor.defaults.slugify(cleaned)
}

const tocFormat = (content, md) => {

  const index = content.indexOf(PROFESSIONAL_SPAN_LABEL);
  return index < 0 ? content : content.substring(0, index)

}

const sortArray = (a, b) => {
  return (a.order || 0) - (b.order || 0);
};

function makeTittle(title) {
  let newTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  let formattedTitle = newTitle.replace(/-/g, ' ')
  return formattedTitle;
}

function processPage(menuItems, menuIndexes, item) {

      const navData = item.data.eleventyNavigation;
      if(navData) {
        const data = item.data;
        let folder = item.url.split("/")[1];
        if(!folder) {
          folder = item.data.page.fileSlug;
        }
        if(!( typeof menuIndexes[folder] == 'number')) {
          const index = menuItems.length;
          menuIndexes[folder] = index;
          menuItems.push({
            title: makeTittle(folder),
            pages: []
          });
        }

        const index = menuIndexes[folder] ;
        if(navData.root) {
          if(navData.page == null || navData.page) {
            menuItems[index].url = data.permalink || item.url;
            menuItems[index].description = data.description;
          }
          menuItems[index].order = navData.order;
        } else {
          menuItems[index].pages.push(
            {
              url: data.permalink || item.url,
              title: makeTittle(data.title),
              description: data.description,
              order: navData.order
            }
          )
        }
      }
   }

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlightPlugin)
  eleventyConfig.addPassthroughCopy('site/favicon')
  eleventyConfig.addPassthroughCopy('site/images')
  eleventyConfig.addPassthroughCopy('site/styles')
  eleventyConfig.addPlugin(eleventyNavigationPlugin);


  const markdownEngine = markdownIt({ html: true })

  markdownEngine.use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#',
    slugify: headerSlugify
  })
  markdownEngine.use(markdownItToc, {
    includeLevel: [1,2,3],
    containerHeaderHtml: '<h2>Table of Contents</h2>',
    slugify: headerSlugify,
    format: tocFormat
  })

// Added by Dieppa
   eleventyConfig.addCollection("menuItems", collection =>{
   let menuIndexes = {};
   let menuItems = [];
   collection.getAll().forEach(item => processPage(menuItems, menuIndexes, item));
   menuItems.sort(sortArray)
   menuItems.forEach(root => root.pages.sort(sortArray))
   
   return menuItems;
 });
     
// End addition


  eleventyConfig.setLibrary('md', markdownEngine)

  return {
    dir: {
      input: 'site',
      output: '_site'
    }
  }
}

