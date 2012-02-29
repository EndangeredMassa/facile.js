(function() {
  var bindArray, bindBindingObject, bindData, bindObject, bindValue, bindValueObject;

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

  bindBindingObject = function($html, key, value) {
    var attr, attrValue, _results;
    _results = [];
    for (attr in value) {
      attrValue = value[attr];
      _results.push(bindValue($html, attr, attrValue));
    }
    return _results;
  };

  bindValueObject = function($html, key, value) {
    var attr, attrValue, _results;
    $html.html(value.value);
    _results = [];
    for (attr in value) {
      attrValue = value[attr];
      if (attr !== 'value') _results.push($html.attr(attr, attrValue));
    }
    return _results;
  };

  bindObject = function($html, key, value) {
    if (value.value != null) {
      return bindValueObject($html, key, value);
    } else {
      return bindBindingObject($html, key, value);
    }
  };

  bindValue = function($html, key, value) {
    var $byId;
    $byId = $html.find('#' + key);
    if ($byId.length > 0) {
      return $byId.html(value);
    } else {
      return $html.find('.' + key).html(value);
    }
  };

  bindData = function($html, key, value) {
    if (value.constructor === Array) {
      return bindArray($html, key, value);
    } else if (value.constructor === Object) {
      return bindObject($html.find('#' + key), key, value);
    } else {
      return bindValue($html, key, value);
    }
  };

  window.facile = function(html, data) {
    var $html, key, value;
    $html = $('<div />').append($(html));
    for (key in data) {
      value = data[key];
      if (value != null) {
        bindData($html, key, value);
      } else {
        $html.find('#' + key).remove();
      }
    }
    return $html.html();
  };

}).call(this);
