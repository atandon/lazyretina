var lazyRetina;

(function() {
  lazyRetina = {};

  var root = (typeof exports === 'undefined' ? window : exports);

  var config = {
    tags: {
      retina: 'data-src-2x',
      normal: 'data-src',
      normalWidth: 'data-src-width'
    },
    container: 'body',
    offset: 300,
    lazyload: true,
    onImageLoad: function() {},
    onBeforeImageLoad: function() {},
    shouldSwitchToNormal: function(elem) {
      return elem.offsetWidth < (elem.getAttribute(this.tags.normalWidth) / 2);
    },
    shouldSwitchToRetina: function(elem) {
      return elem.offsetWidth > elem.getAttribute(this.tags.normalWidth);
    }
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

  var ElemInViewport = function(elem) {
    var loadingRangeHeight = (window.innerHeight || document.documentElement.clientHeight) + config.offset;
    if(elem) {
      var rect = elem.getBoundingClientRect();
      return ((rect.top >= -config.offset && rect.top <= loadingRangeHeight) ||
              (rect.bottom >= -config.offset && rect.bottom <= loadingRangeHeight));
    }

    return false;
  };

  var isImage = function(elem) {
    return elem.tagName.toLowerCase() === 'img';
  };

  var loadImage = function(elem,src,callback) {
    var img = new Image();

    config.onBeforeImageLoad(elem);

    elem.removeAttribute(config.tags.retina);
    elem.removeAttribute(config.tags.normal);

    img.onload = function(resp) {
      elem.style.visibility = 'visible';
      callback();
      config.onImageLoad(elem);
    };

    img.src = src;
  };

  var getImagePath = function(elem, isRetina) {
    var imgTag = ((isRetina && !config.shouldSwitchToNormal(elem)) || 
                   config.shouldSwitchToRetina(elem)) ? config.tags.retina : config.tags.normal;
    var imgTagValue = elem.getAttribute(imgTag);

    return imgTagValue ? imgTagValue : false;
  };

  var setImageStyle = function(elem) {
    elem.removeAttribute('src');
    elem.style.visibility = 'hidden';
    elem.style.backgroundImage = '';
  };

  var load = function() {
    var selectorName = config.container + " " + "["+config.tags.normal+"]";
    var elems = document.querySelectorAll(selectorName),
        elemsLength = elems.length,
        isRetina = lazyRetina.isRetina(),
        imgPath;

    for(var x=0; x < elemsLength; x++) {
      if( (ElemInViewport(elems[x]) || !config.lazyload) &&
          elems[x].getAttribute('data-no-retina-lazy') == null) {
        imgPath = getImagePath(elems[x],isRetina);
        setImageStyle(elems[x]);

        if(imgPath) {
          loadImage(elems[x],imgPath,function(elem,imgPath) {
            isImage(elem) ?  elem.setAttribute('src',imgPath) :
                             elem.style.backgroundImage = "url('"+imgPath+"')";
          }.bind(this,elems[x],imgPath));
        }
      }
    }
  };

  lazyRetina.init = function(options) {
    this.configure(options);
    load(config);
    root.onload = function() { load(config); };
    $(document).on('touchmove',function() { load(config); });

    if(config.lazyload) {
      root.onscroll = function() { load(config); };
    }
  };

})(this);