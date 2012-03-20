(function() {
  var bindArray, bindBindingObject, bindData, bindObject, bindValue, bindValueObject, combineClasses;

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
      if (attr !== 'value') {
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
      return "" + existingClasses + " " + newClasses;
    } else {
      return newClasses;
    }
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

  window.facile = function(html, data) {
    var $html, key, value;
    $html = $('<div />').append($(html));
    for (key in data) {
      value = data[key];
      if (value != null) {
        bindData($html, key, value);
      } else {
        $html.find('#' + key).remove();
        $html.find('.' + key).remove();
      }
    }
    return $html.html();
  };

}).call(this);
