lazyRetina
==========

lazy loading + high-res image rendering based on device screen

## Why?

* Pages load faster
* Pages load with the appropriate high-res image
* Supports \<img> and background images
* Easier to handle callbacks on and before image load


## How to use?

In the \<head> tag:

```
<script type='text/javascript' src='lazyretina.min.js'></script>

<script type='text/javascript'>
var options = {};
lazyRetina.init(options);
</script>

```

In your html:


```
  // Images
  <img data-src='img1.jpg' data-src-2x='img2.jpg' />

  // Background images
  <div data-src='background1.jpg' data-src-2x='background1.jpg' />
```


## Options

### Custom Tags
You can chose custom tags instead of using the default 'data-src' and 'data-src-retina':

```
var options = {tags: {normal: 'data-source', retina: 'data-src-retina'}};
```

### Container

You can specify the container in which lazy retina will execute.  The default is body.

```
var options = {container: '#parent-div'};
```

### Offset

The lazy loader renders images at a default 100px offset from the client screen top and bottom.
You can specify the px offset by adding: 

```
var options = {offset: 600};
```

### Event handlers

#### onImageLoad

This callback runs every time an image is successfully loaded.

```
var options = {
  onImageLoad: function() { 
    alert('successfully loaded image!'); 
  }
};
```

#### onBeforeImageLoad

This callback runs every time before an image loads.

```
var options = {
  onBeforeImageLoad: function() {
    alert('image is about to load!');
  }
};
