
# facile - template engine
# ========================
# depends on jQuery
# features:
#   key: string => #id
#   key: null   => #id (removed)
#   key: array  => .class
#   key: 
#     value: string/array
#     'data-attr': string

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
  if value.constructor == Array
    bindArray($html, key, value)
  else if value.constructor == Object
    bindObject($html.find('#'+key), key, value)
  else
    $html.find('#'+key).html(value)

window.facile = (html, data) ->
  $html = $('<div />').append($(html))
  for key, value of data
    if value?
      bindValue($html, key, value)
    else
      $html.find('#'+key).remove()
      
  $html.html()




