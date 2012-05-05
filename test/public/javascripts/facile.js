(function() {
  var bindArray, bindBindingObject, bindContentObject, bindData, bindNullableData, bindObject, bindValue, combineClasses, find;

  find = function($el, key) {
    var $result;
    $result = $el.find('#' + key);
    if ($result.length === 0) $result = $el.find('.' + key);
    return $result;
  };

  bindArray = function($html, key, value) {
    var $clone, $nested, $root, $template, arrayValue, newHtml, _i, _len, _results;
    $root = find($html, key);
    if ($root.length === 0) return;
    $nested = find($root, key);
    if ($nested.length > 0) $root = $nested;
    if ($root.is('table')) $root = $root.find('tbody');
    $template = $root.children().remove();
    _results = [];
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      arrayValue = value[_i];
      $clone = $template.clone();
      if (arrayValue.constructor === Object) {
        newHtml = facile($clone, arrayValue);
        _results.push($root.append(newHtml));
      } else {
        $clone.html(arrayValue);
        _results.push($root.before($clone));
      }
    }
    return _results;
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
    var $el;
    $el = find($html, key);
    if ($el.length > 0) return $el.html(value);
  };

  bindData = function($html, key, value) {
    var $target;
    if (value.constructor === Array) {
      return bindArray($html, key, value);
    } else if (value.constructor === Object) {
      $target = find($html, key);
      return bindObject($target, key, value);
    } else {
      return bindValue($html, key, value);
    }
  };

  bindNullableData = function($html, key, value) {
    var $el;
    if (value != null) {
      return bindData($html, key, value);
    } else {
      $el = find($html, key);
      return $el.remove();
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
