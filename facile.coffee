
bindArray = ($html, key, value) ->
  $original = $html.find('.'+key)
  for arrayValue in value
    $clone = $original.clone()
    if arrayValue.constructor == Object
      bindObject($clone, key, arrayValue)
    else
      $clone.html(arrayValue)
    $original.before($clone)
  $original.remove()

bindObject = ($html, key, value) ->
  $html.html(value.value)
  for attr, attrValue of value when attr != 'value'
    $html.attr(attr, attrValue)

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
    bindObject($html.find('#'+key), key, value)
  else
    bindValue($html, key, value)

window.facile = (html, data) ->
  $html = $('<div />').append($(html))
  for key, value of data
    if value?
      bindData($html, key, value)
    else
      $html.find('#'+key).remove()
      
  $html.html()




