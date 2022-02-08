const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItToc = require('markdown-it-table-of-contents')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
/**
 * HTML tags to remove from TOC
 */
const PROFESSIONAL_SPAN_LABEL = "<span class=\"professional\">";
const PROFESSIONAL_A_LABEL = '<a href="/professional">';

/**
 * FOLDERS TO REMOVE FROM SIDE MENU
 */
const EXCLUDE_FROM_MENU = new Set();
EXCLUDE_FROM_MENU.add("pro");
EXCLUDE_FROM_MENU.add("pending");
EXCLUDE_FROM_MENU.add("roadmap");

/**
 * VERSIONS
 */
const versions = [];
versions.push({name: "version 5", value: "v5", default: true, index: "/index.html"});
versions.push({name: "version 4", value: "v4", index: "/v4/index.html"});
versions.push({name: "version 3", value: "v3", index: "/v3/index.html"});

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
  }
  const cleaned = text.replace(/<\/?code>/g, '').replace(/(&lt;|&gt;|[<>])/g, '')
  return markdownItAnchor.defaults.slugify(cleaned)
}

const tocFormat = (content, md) => {

  const index = content.indexOf(PROFESSIONAL_SPAN_LABEL);
  return index < 0 ? content : content.substring(0, index)

}

const sortMenu = (a, b) => {
  return (a.order || 0) - (b.order || 0);
};


function makeTittle(title) {
  let newTitle = title.charAt(0).toUpperCase() + title.slice(1);
  let formattedTitle = newTitle.replace(/-/g, ' ')
  return formattedTitle;
}

function processPage(versionFolderFilter, menuItems, menuIndexes, item) {

      const navData = item.data.eleventyNavigation;
      if(navData) {
        let versionFolder = navData.version;
        let folder = item.url.split("/")[2];
        if(!folder) {
          folder = item.data.page.fileSlug;
        }
        
        

        if(EXCLUDE_FROM_MENU.has(folder) || versionFolder != versionFolderFilter) {
          return;
          
        }
        if(!( typeof menuIndexes[folder] == 'number')) {
          const index = menuItems.length;
          menuIndexes[folder] = index;
          menuItems.push({
            title: makeTittle(item.data.upperCase ? folder.toUpperCase() : folder),
            pages: []
          });
        }

        const data = item.data;
        const index = menuIndexes[folder];
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
   eleventyConfig.addCollection("versionedMenus", collection =>{
   let versionedMenus = [];
   versions.forEach(version => {
     let menuIndexes = {};
     let menuItemsArray = [];
     collection.getAll().forEach(item => processPage(version.value, menuItemsArray, menuIndexes, item));  
     menuItemsArray.sort(sortMenu)
     menuItemsArray.forEach(root => root.pages.sort(sortMenu))
     versionedMenus.push(
       {
         menuItems: menuItemsArray,
         name: version.name,
         value: version.value,
         default: version.default,
         index: version.index 
       }
     );
   });
   return versionedMenus;
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

