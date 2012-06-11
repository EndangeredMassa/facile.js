find = ($el, key) ->
  $result = $el.find('#' + key)
  $result = $el.find('.' + key) if $result.length == 0
  $result

combineClasses = (existingClasses, newClasses) ->
  if existingClasses
    if newClasses.length > 0
      "#{existingClasses} #{newClasses}"
    else
      existingClasses
  else
    newClasses

window.facile = (template, data) ->
  $template = $('<div />').append($(template))
  for key, value of data
    bindOrRemove($template, key, value)
  $template.html()

bindOrRemove = ($template, key, value) ->
  if value?
    bindData($template, key, value)
  else
    $el = find($template, key)
    $el.remove()

bindData = ($template, key, value) ->
  if value.constructor == Array
    bindArray($template, key, value)
  else if value.constructor == Object
    $target = find($template, key)
    bindObject($target, key, value)
  else
    bindValue($template, key, value)

bindArray = ($template, key, value) ->
  $root = find($template, key)
  return if $root.length == 0

  $nested = find($root, key)
  if $nested.length > 0
    $root = $nested

  if $root.is('table')
    $root = $root.find('tbody')

  $child = $root.children().remove()
  for arrayValue in value
    $clone = $child.clone()
    if arrayValue.constructor == Object
      newHtml = facile($clone, arrayValue)
      $root.append(newHtml)
    else
      $clone.html(arrayValue)
      $root.before($clone)

bindObject = ($template, key, value) ->
  if value.content?
    bindAttributeObject($template, key, value)
  else
    bindNestedObject($template, key, value)

bindValue = ($template, key, value) ->
  if key.indexOf('@') != -1
    [key, attr] = key.split('@')
    $el = find($template, key)
    if $el.prop('tagName') == 'SELECT'
      $el.find("option[value='#{value}']").attr('selected', 'selected')
    else
      $el.attr(attr, value)
  else
    $el = find($template, key)
    if $el.length > 0
      if $el.prop('tagName') == 'INPUT'
        $el.attr('value', '' + value)
      else
        $el.html('' + value)

bindNestedObject = ($template, key, value) ->
  for attr, attrValue of value
    bindOrRemove($template, attr, attrValue)

bindAttributeObject = ($template, key, value) ->
  $template.html(value.content)
  for attr, attrValue of value when attr != 'content'
    if attr == 'class'
      $template.attr('class', combineClasses($template.attr('class'), attrValue))
    else
      $template.attr(attr, attrValue)
