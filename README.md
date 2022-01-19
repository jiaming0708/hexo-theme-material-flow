[![Publish Package to npmjs](https://github.com/jiaming0708/hexo-theme-material-flow/actions/workflows/deploy-npm.yml/badge.svg)](https://github.com/jiaming0708/hexo-theme-material-flow/actions/workflows/deploy-npm.yml) [![npm version](https://badge.fury.io/js/hexo-theme-material-flow.svg)](https://badge.fury.io/js/hexo-theme-material-flow)

# Material Flow

Fork from [kevin tan](https://github.com/stkevintan/hexo-theme-material-flow)

See [DEMO](https://jiaming0708.github.io)

## Installation
```bash
npm i hexo-theme-material-flow
yarn add hexo-theme-material-flow
```

use `ejs` and `less` for this theme, also need to install
```bash
yarn add hexo-renderer-less hexo-renderer-less
```

## Configuration
1. Change the value of `theme` to `material-flow` in `_config.yml`.
2. Create a config file for theme, `_config.material-flow.yml`.
3. Put your avatar && favicon images to `source/images/`.
4. Edit `_config.yml` and `themes/material-flow/_config.yml` for your needs.


Here are some examples:
1. [_config.yml](https://github.com/jiaming0708/blog-source/blob/master/_config.yml)
2. [_config_material-flow.yml](https://github.com/jiaming0708/blog-source/blob/master/config_material-flow.yml)

### links
default is empty list
```
links:
  - name: yahoo taiwan
    url: https://tw.yahoo.com
```

### social medial
default only have rss in the list, support these icons
* facebook
* github
* google
* instagram
* pinterest
* tumblr
* twitter
* rss

please set the full url, not username
```
social:
- slug: rss
  url: /atom.xml
```

## More 
Please refer to offical doc : <https://hexo.io/docs/index.html>
