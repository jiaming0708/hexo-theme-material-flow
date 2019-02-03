# Material Flow

Fork from [kevin tan](https://github.com/stkevintan/hexo-theme-material-flow)

See [DEMO](https://jiaming0708.github.io)

## Installation
```bash
# change to work dir
cd /your_blog_dir/
# install dependencies
npm i -S hexo-generator-search hexo-generator-feed hexo-renderer-less hexo-autoprefixer hexo-generator-json-content
# download source
git clone https://github.com/jiaming0708/hexo-theme-material-flow themes/material-flow
```

## Configuration
1. Change the value of `theme` to `material-flow` in `_config.yml`.
2. Put your avatar && favicon images to `source/images/`.
3. Edit `_config.yml` and `themes/material-flow/_config.yml` for your needs.


Here are some examples:
1. [_config.yml](https://github.com/jiaming0708/blog-source/blob/master/_config.yml)
2. [themes/material-flow/_config.yml](https://github.com/jiaming0708/blog-source/blob/master/themes/material-flow/_config.yml)

## Enable article read-time
install [hexo-symbols-count-time](https://github.com/theme-next/hexo-symbols-count-time)

```bash
npm i hexo-symbols-count-time
```

add config in `_config.yml` of root of your blog
```yml
# article read time
symbols_count_time:
  symbols: true
  time: true
  total_symbols: true
  total_time: true
```

## More 
Please refer to offical doc : <https://hexo.io/docs/index.html>
