(function() {
  var bindArray, bindBindingObject, bindContentObject, bindData, bindNullableData, bindObject, bindValue, combineClasses;

  bindArray = function($html, key, value) {
    var $clone, $original, arrayValue, _i, _len;
    $original = $html.find('.' + key);
    if ($original.is('table')) $original = $original.find('tbody tr');
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
      _results.push(bindNullableData($html, attr, attrValue));
    }
    return _results;
  };

  bindContentObject = function($html, key, value) {
    var attr, attrValue, _results;
    $html.html(value.content);
    _results = [];
    for (attr in value) {
      attrValue = value[attr];
      if (attr !== 'content') {
        if (attr === 'class') {
          _results.push($html.attr('class', combineClasses($html.attr('class'), attrValue)));
        } else {
          _results.push($html.attr(attr, attrValue));
        }
      }
    }
    return _results;
  };

  combineClasses = function(existingClasses, newClasses) {
    if (existingClasses) {
      if (newClasses.length > 0) {
        return "" + existingClasses + " " + newClasses;
      } else {
        return existingClasses;
      }
    } else {
      return newClasses;
    }
  };

  bindObject = function($html, key, value) {
    if (value.content != null) {
      return bindContentObject($html, key, value);
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
    var $target;
    if (value.constructor === Array) {
      return bindArray($html, key, value);
    } else if (value.constructor === Object) {
      $target = $html.find('#' + key);
      if ($target.length === 0) $target = $html.find('.' + key);
      return bindObject($target, key, value);
    } else {
      return bindValue($html, key, value);
    }
  };

  bindNullableData = function($html, key, value) {
    if (value != null) {
      return bindData($html, key, value);
    } else {
      $html.find('#' + key).remove();
      return $html.find('.' + key).remove();
    }
  };

  window.facile = function(html, data) {
    var $html, key, value;
    $html = $('<div />').append($(html));
    for (key in data) {
      value = data[key];
      bindNullableData($html, key, value);
    }
    return $html.html();
  };

}).call(this);
