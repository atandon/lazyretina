var lazyRetina;

(function() {
  lazyRetina = {};

  var root = (typeof exports === 'undefined' ? window : exports);

  var config = {
    tags: {
      retina: 'data-src-2x',
      normal: 'data-src'
    },
    container: 'body',
    offset: 100,
    lazyload: true,
    onImageLoad: function() {},
    onBeforeImageLoad: function() {}
  };

  lazyRetina.configure = function(options) {
    if (options === null) {
      options = {};
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        config[prop] = options[prop];
      }
    }
  };

  lazyRetina.isRetina = function() {
    var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

    if (window.devicePixelRatio > 1) {
      return true;
    }

    if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
      return true;
    }

    return false;
  };

  // element in viewport TODO: FIX so that, any image in viewport, loads
  var ElemInViewport = function(elem) {
    var loadingRangeHeight = (window.innerHeight || document.documentElement.clientHeight) + config.offset;
    if(elem) {
      var rect = elem.getBoundingClientRect();
      return ((rect.top >= -config.offset && rect.top <= loadingRangeHeight) ||
              (rect.bottom >= -config.offset && rect.bottom <= loadingRangeHeight));
    };

    return false;
  };

  var isImage = function(elem) {
    return elem.tagName.toLowerCase() === 'img';
  }

  var loadImage = function(elem,src,callback) {
    var img = new Image();

    config.onBeforeImageLoad(elem);

    elem.removeAttribute(config.tags.retina)
    elem.removeAttribute(config.tags.normal);

    img.onload = function(resp) {
      callback();
      config.onImageLoad(elem);
    };

    img.src = src;
  };

  var getImagePath = function(elem, isRetina) {
    var imgTag = (isRetina) ? config.tags.retina : config.tags.normal;

    if(elem.getAttributeNode(imgTag)) {
      return elem.getAttribute(imgTag);
    }

    return false;
  };

  var load = function() {
    var selectorName = config.container + " " + "["+config.tags.normal+"]";
    var elems = document.querySelectorAll(selectorName),
        elemsLength = elems.length,
        isRetina = lazyRetina.isRetina(),
        imgPath;

    for(var x=0; x < elemsLength; x++) {
      if( (ElemInViewport(elems[x]) || !config.lazyload) && 
          elems[x].getAttributeNode('data-no-retina-lazy') == null) {
        imgPath = getImagePath(elems[x],isRetina);

        if(imgPath) {
          loadImage(elems[x],imgPath,function(elem,imgPath) {
            isImage(elem) ?  elem.setAttribute('src',imgPath) :
                             elem.style.backgroundImage = "url('"+imgPath+"')";
          }.bind(this,elems[x],imgPath));
        }
      }
    };
  };

  lazyRetina.init = function(options) {
    this.configure(options);
    load(config);
    root.onload = function() { load(config); };

    if(config.lazyload) {
      root.onscroll = function() { load(config); };
    }
  };

})(this);