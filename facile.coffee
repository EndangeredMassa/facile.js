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
    bindValue($html, attr, attrValue)

bindValueObject = ($html, key, value) ->
  $html.html(value.value)
  for attr, attrValue of value when attr != 'value'
    $html.attr(attr, attrValue)

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

window.facile = (html, data) ->
  $html = $('<div />').append($(html))
  for key, value of data
    if value?
      bindData($html, key, value)
    else
      $html.find('#'+key).remove()
      $html.find('.'+key).remove()
      
  $html.html()
