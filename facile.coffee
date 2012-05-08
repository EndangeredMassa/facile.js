find = ($el, key) ->
  $result = $el.find('#' + key)
  $result = $el.find('.' + key) if $result.length == 0
  $result

bindArray = ($html, key, value) ->
  $root = find($html, key)
  return if $root.length == 0

  $nested = find($root, key)
  if $nested.length > 0
    $root = $nested

  if $root.is('table')
    $root = $root.find('tbody')

  $template = $root.children().remove()
  for arrayValue in value
    $clone = $template.clone()
    if arrayValue.constructor == Object
      newHtml = facile($clone, arrayValue)
      $root.append(newHtml)
    else
      $clone.html(arrayValue)
      $root.before($clone)

bindBindingObject = ($html, key, value) ->
  for attr, attrValue of value
    bindNullableData($html, attr, attrValue)

bindContentObject = ($html, key, value) ->
  $html.html(value.content)
  for attr, attrValue of value when attr != 'content'
    if attr == 'class'
      $html.attr('class', combineClasses($html.attr('class'), attrValue))
    else
      $html.attr(attr, attrValue)

combineClasses = (existingClasses, newClasses) ->
  if existingClasses
    if newClasses.length > 0
      "#{existingClasses} #{newClasses}"
    else
      existingClasses
  else
    newClasses

bindObject = ($html, key, value) ->
  if value.content?
    bindContentObject($html, key, value)
  else
    bindBindingObject($html, key, value)

bindValue = ($html, key, value) ->
  if key.indexOf('@') != -1
    [key, attr] = key.split('@')
    $el = find($html, key)
    $el.attr(attr, value)
  else
    $el = find($html, key)
    $el.html(value) if $el.length > 0

bindData = ($html, key, value) ->
  if value.constructor == Array
    bindArray($html, key, value)
  else if value.constructor == Object
    $target = find($html, key)
    bindObject($target, key, value)
  else
    bindValue($html, key, value)

bindNullableData = ($html, key, value) ->
  if value?
    bindData($html, key, value)
  else
    $el = find($html, key)
    $el.remove()

window.facile = (html, data) ->
  $html = $('<div />').append($(html))
  for key, value of data
    bindNullableData($html, key, value)

  $html.html()
