/*! ---------------------------------------
 *  Anchorjump
 * ---------------------------------------- */

(function($) {
  var defaults = {
    speed: 500,
    offset: 0,
    for: null,
    parent: null
  };

  $.fn.anchorjump = function(options) {
    options = $.extend({}, defaults, options);

    if (options['for']) {
      this.on('click', options['for'], onClick);
    } else {
      this.on('click', onClick);
    }

    function onClick(e) {
      var $a = $(e.target).closest('a');
      if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

      e.preventDefault();
      var href = $a.attr('href');

      $.anchorjump(href, options);
    };
  };

  // Jump to a given area.
  $.anchorjump = function(href, options) {
    options = $.extend({}, defaults, options);

    var top = 0;

    if (href != '#') {
      var $area = $(href);
      // Find the parent
      if (options.parent) {
        var $parent = $area.closest(options.parent);
        if ($parent.length) { $area = $parent; }
      }
      if (!$area.length) { return; }
      top = $area.offset().top + options.offset;
    }

    $('html, body').animate({ scrollTop: top }, options.speed);
    $('body').trigger('anchor', href);

    // Add the location hash via pushState.
    if (window.history.pushState) {
      window.history.pushState({ href: href }, "", href);
    }
  };
})(jQuery);

(function() {
  // Anchorjump
  $(function() {
    $("body").anchorjump({ for: 'a[href^="#"]', speed: 1000  });
  });

  var template = _.template($("#senator-template").html());

  // Partial
  function formatValue(val, type, section) {
    var m;
    if (section === 'Info') {
      // External info
      return "<a href='"+val+"' class='pre site' target='_blank'>"+type+"</a>";
    } else if (m = val.match(/facebook\.com\/(?:pages\/)?(.*?)(?:\/[0-9]+)?$/)) {
      // Facebook
      return "<a href='"+val+"' class='pre facebook' target='_blank'>"+m[1]+"</a>";
    } else if (m = val.match(/twitter\.com\/(.*)$/)) {
      // Twitter
      return "<a href='"+val+"' class='pre twitter' target='_blank'>@"+m[1]+"</a>";
    } else if (m = val.match(/youtube\.com\/(.*)$/)) {
      // Youtube
      return "<a href='"+val+"' class='pre youtube' target='_blank'>@"+m[1]+"</a>";
    } else if (m = val.match(/@[a-z\.]+$/)) {
      // Email
      return "<a href='mailto:"+val+"' class='pre email' target='_blank'>"+val+"</a>";
    } else if (m = val.match(/^https?:\/\/([^\/]+)/)) {
      // Website
      return "<a href='"+val+"' class='pre site' target='_blank'>"+m[1]+"</a>";
    } else if (type === "Address") {
      // Address
      return "<span class='address'>"+val+"</span>";
    } else {
      return "<span class='other'>"+val+" <small>"+type+"</small></span>";
    }
  }

  Addresses = {
    load: function(data) {
      var $parent = $("<div>");

      $.each(data.contactInfo, function(name, data) {
        var $el = template({ data: data, name: name, formatValue: formatValue });
        $parent.append($el);
      });

      $("#senators .list").append($parent);
      $("#senators .list > div").masonry();

    }
  };

  window.Addresses = Addresses;
})();
