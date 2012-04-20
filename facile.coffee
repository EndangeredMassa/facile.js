bindArray = ($html, key, value) ->
  $original = $html.find('.'+key)
  return if $original.length == 0

  $nested = $original.find('.'+key)
  if $nested.length > 0
    $original = $nested

  if $original.is('table')
    $original = $original.find('tbody tr')
  for arrayValue in value
    $clone = $original.clone()
    if arrayValue.constructor == Object
      bindObject($clone, key, arrayValue)
    else
      $clone.html(arrayValue)
    $original.before($clone)
  $original.remove()

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
  $byId = $html.find('#'+key)
  if $byId.length > 0
    $byId.html(value)
  else
    $html.find('.'+key).html(value)

bindData = ($html, key, value) ->
  if value.constructor == Array
    bindArray($html, key, value)
  else if value.constructor == Object
    $target = $html.find('#'+key)
    $target = $html.find('.'+key) if $target.length == 0
    bindObject($target, key, value)
  else
    bindValue($html, key, value)

bindNullableData = ($html, key, value) ->
  if value?
    bindData($html, key, value)
  else
    $html.find('#'+key).remove()
    $html.find('.'+key).remove()

window.facile = (html, data) ->
  $html = $('<div />').append($(html))
  for key, value of data
    bindNullableData($html, key, value)

  $html.html()
