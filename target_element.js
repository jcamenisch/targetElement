(function($, undefined) {

  $.fn.targetElement = function(options){
    options = options || {};

    var a = this, $a = $(a), result = false;

    var lookups = {

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

    var lookupOrder = [].concat(
      'memoized',
      (options.lookupOrder || ['internalHref', 'forAttr', 'rel', 'externalHref']),
      'empty'
    );

    for (var i=0, l=lookupOrder.length; i<l; i++) {
      var
        applicable, get, always = function() { return true; },
        lookup = lookupOrder[i]  
      ;

      if (typeof lookup === 'string') lookup = lookups[lookup];
      if (typeof lookup === 'function') {
        applicable = always;
        get = lookup;
      } else if (typeof lookup === 'object') {
        applicable = lookup.applicable || always;
        get = lookup.get;
      }

      if (applicable()) result = get();
      if (result && result.length) break;
    }

    a.data('target-element', result);
    return result;
  }

})(jQuery);