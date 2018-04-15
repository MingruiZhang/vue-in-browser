# Vue In Browser [![npm version](http://badge.fury.io/js/vue-in-browser.svg)](http://badge.fury.io/js/vue-in-browser) [![Dependency Status](http://david-dm.org/MingruiZhang/vue-in-browser.svg)](http://david-dm.org/MingruiZhang/vue-in-browser)

> Compile and render [*.vue](https://vue-loader.vuejs.org/en/start/spec.html) component in browser on the fly.

### Download

```
https://unpkg.com/vue-in-browser@1.2.3/dist/bundle.min.js
```

## Why?

Provide way to _quick prototyping_ with vue component. No need to install any dependencies to your project.

**In real projects you should use [`vue-loader`](https://github.com/vuejs/vue-loader) or [`vueify`](https://github.com/vuejs/vueify) instead**

## Usage

Just include the script on the page and create another inline script to call `loadVueComponent(filePath, element)`, with `filePath` being path (relative or absolute) to your `*.vue` file and `element` indicating the DOM element selector you want to render the vue component on.

```html
<div id="app"></div>

<script src="https://unpkg.com/vue-in-browser@1.2.3/dist/bundle.min.js"></script>
<script> loadVueComponent('./path/to/your/app.vue', '#app') </script>
```

## Support

Basic `template` / `style`/ `script` code blocks:

```html
// app.vue
<style>
  .red {
    color: #f00;
  }
</style>

<template>
  <h1 class="red">{{msg}}</h1>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>
```

You can import using the `src` attribute:

```html
// app-with-import.vue
<style src="./path/to/your/style.css"></style>

<template src="./path/to/your/template.html"></template>

<script src="./path/to/your/script.js"></script>
```

Javascript support will be based on your browser, so you can write ES2015 if your browser supports, use libraries like [@babel/standalone](https://github.com/babel/babel/tree/master/packages/babel-standalone) if necessary.

**NOTE:** importing other components from script doesn't work. However you can call multiple `loadVueComponent()` to achieve it.

```html
// container.vue
<template>
  <div class="container">
    <div id="module-1"></div>
    <div id="module-2"></div>
  </div>
</template>

// module-1.vue
...

// module-2.vue
...

// html
<div id="app"></div>

<script>
  loadVueComponent('./container.vue', '#app').then(() => {
    // Chain the function calls so the container component is rendered before subsequent load applies.
    loadVueComponent('./module-1.vue', '#module-1');
    loadVueComponent('./module-2.vue', '#module-2');
  })
</script>
```

Scoped CSS, CSS module, mix preprocessor languages not supported yet.

## License

[MIT](http://opensource.org/licenses/MIT)


