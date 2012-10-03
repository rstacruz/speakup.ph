(function() {
  var template = _.template($("#senator-template").html());

  // Partial
  function formatValue(val, type, section) {
    var m;
    if (section === 'Info') {
      // External info
      return "<a href='"+val+"' class='pre site'>"+type+"</a>";
    } else if (m = val.match(/facebook\.com\/(?:pages\/)?(.*?)(?:\/[0-9]+)?$/)) {
      // Facebook
      return "<a href='"+val+"' class='pre facebook'>"+m[1]+"</a>";
    } else if (m = val.match(/twitter\.com\/(.*)$/)) {
      // Twitter
      return "<a href='"+val+"' class='pre twitter'>@"+m[1]+"</a>";
    } else if (m = val.match(/@[a-z\.]+$/)) {
      // Email
      return "<a href='mailto:"+val+"' class='pre email'>"+val+"</a>";
    } else if (m = val.match(/^https?:\/\/([^\/]+)/)) {
      // Website
      return "<a href='"+val+"' class='pre site'>"+m[1]+"</a>";
    } else {
      return "<span class='other'>"+val+"</span>";
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
