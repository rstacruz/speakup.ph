(function() {
  var template = _.template($("#senator-template").html());

  Addresses = {
    load: function(data) {
      var $parent = $("<div>");

      $.each(data.contactInfo, function(name, data) {
        var $el = template({ data: data, name: name });
        $parent.append($el);
      });

      $("#senators .list").append($parent);
      $("#senators .list > div").masonry();

    }
  };

  window.Addresses = Addresses;
})();
