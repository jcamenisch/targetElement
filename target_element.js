(function($, undefined) {

  $.fn.targetElement = function(options){
    options = options || {};

    var a = this, $a = $(a), result = false;

    var lookupFunctions = {

      memoized: function() { return $a.data('target-element') },

      internalHref: {
        applicable: function() { return a.attr('href') && a.attr('href').match(/^#.+/)},
        get:        function() {
                      var result = $(a.attr('href'));
                      if (!result.length)
                        result = $('a[name='+a.attr('href').replace(/^#/,'')+']').parent();
                      return result;
                    }
      },

      forAttr: {
        applicable: function() { return a.attr('for') },
        get:        function() { return $('#'+a.attr('for')); }
      },

      rel: {
        applicable: function() { return a.attr('rel'); },
        get:        function() { return $(a.attr('rel')); }
      },

      externalHref: {
        applicable: function() {
          return options.preload && a.attr('href') && a.attr('href').match(/^[^#].+/)
        },
        get: function() {
          var result = $(options.preload.skeleton || '<div/>').hide();
          if (options.preload.insertAfter)
            result.insertAfter($(options.preload.insertAfter).last());
          $.ajax({

            url: this.attr('href')+'?xhr=true',
            beforeSend: options.preload.beforeSend,
            
            success: function(data, textStatus, xhr) {
              var subpage;
              if (options.preload.subpage && (subpage = $(data).filter(options.preload.subpage)).length) {
                result
                  .html(subpage.html())
                  .attr('class', subpage.attr('class'))
                  .attr('id', subpage.attr('id'))
                ;
              } else {
                result.html(data);
              }
            },
            
            error: function( xhr, status ) {
              result.html('There was an error loading the requested page. Error code: '+status);
            },
            
            complete: options.preload.complete

          });
          return result;
        }
      },

      empty: function() { return $(); }

    };

    var lookupBy = [].concat(
      'memoized',
      (options.lookupBy || ['internalHref', 'forAttr', 'rel', 'externalHref']),
      'empty'
    );

    for (var i = 0, l = lookupBy.length; i < l; i++) {
      var
        applicable, get,
        always = function() { return true; },
        nextLookupFn = lookupBy[i]
      ;

      if (typeof nextLookupFn === 'string') nextLookupFn = lookupFunctions[nextLookupFn];
      if (typeof nextLookupFn === 'function') {
        applicable = always;
        get = nextLookupFn;
      } else if (typeof nextLookupFn === 'object') {
        applicable = nextLookupFn.applicable || always;
        get = nextLookupFn.get;
      }

      if (applicable()) result = get();
      if (result && result.length) break;
    }

    a.data('target-element', result);
    return result;
  }

})(jQuery);