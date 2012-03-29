bindArray = ($html, key, value) ->
  $original = $html.find('.'+key)
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

bindValueObject = ($html, key, value) ->
  $html.html(value.value)
  for attr, attrValue of value when attr != 'value'
    if attr == 'class'
      $html.attr('class', combineClasses($html.attr('class'), attrValue))
    else
      $html.attr(attr, attrValue)

combineClasses = (existingClasses, newClasses) ->
  if existingClasses
    "#{existingClasses} #{newClasses}"
  else
    newClasses

bindObject = ($html, key, value) ->
  if value.value?
    bindValueObject($html, key, value)
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
