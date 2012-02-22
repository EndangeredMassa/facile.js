(function() {
  var bindArray, bindObject, bindValue;

  bindArray = function($html, key, value) {
    var $clone, $original, arrayValue, _i, _len;
    $original = $html.find('.' + key);
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      arrayValue = value[_i];
      $clone = $original.clone();
      if (arrayValue.constructor === Object) {
        bindObject($clone, key, arrayValue);
      } else {
        $clone.html(arrayValue);
      }
      $original.before($clone);
    }
    return $original.remove();
  };

  bindObject = function($html, key, value) {
    var attr, attrValue, _results;
    $html.html(value.value);
    _results = [];
    for (attr in value) {
      attrValue = value[attr];
      if (attr !== 'value') _results.push($html.attr(attr, attrValue));
    }
    return _results;
  };

  bindValue = function($html, key, value) {
    if (value.constructor === Array) {
      return bindArray($html, key, value);
    } else if (value.constructor === Object) {
      return bindObject($html.find('#' + key), key, value);
    } else {
      return $html.find('#' + key).html(value);
    }
  };

  window.facile = function(html, data) {
    var $html, key, value;
    $html = $('<div />').append($(html));
    for (key in data) {
      value = data[key];
      if (value != null) {
        bindValue($html, key, value);
      } else {
        $html.find('#' + key).remove();
      }
    }
    return $html.html();
  };

}).call(this);
