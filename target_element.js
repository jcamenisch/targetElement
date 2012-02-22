(function($){
  $.fn.targetElement = function(options){
    if (this.data('target-element')) return this.data('target-element');

    var result = $()
    var a = this
    function remote_content(){ return a.attr('href') && a.attr('href').match(/^[^#].+/) }

    if (a.attr('href') && a.attr('href').match(/^#.+/)) {
      result = $(a.attr('href'));
      if (!result.length)
        result = $('a[name='+a.attr('href').replace(/^#/,'')+']').parent(); 
    }
    if (!result.length)
      result = $('#'+a.attr('for'));
    if (!result.length && a.attr('rel'))
      result = $(a.attr('rel'));
    if (!result.length && remote_content() && options && options.preload) {
      var result = $(options.preload.skeleton || '<div/>').hide();
      if (options.preload.insertAfter)
        result.insertAfter($(options.preload.insertAfter).last());
      $.ajax({
        url: this.attr('href')+'?xhr=true',
        beforeSend: options.preload.beforeSend,
        success: function(data, textStatus, xhr) {
          var subpage;
          if (options.preload.subpage && (subpage = $(data).filter(options.preload.subpage)).length) {
            result.html(subpage.html())
              .attr('class',subpage.attr('class'))
              .attr('id',subpage.attr('id'));
          } else {
            result.html(data);
          }
        },
        error: function( xhr, status ) {
          result.html('There was an error loading the requested page. Error code: '+status);
        },
        complete: options && options.preload.complete
      });
    }

    a.data('target-element', result);
    return result;
  }
})(jQuery);