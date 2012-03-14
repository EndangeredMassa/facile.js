describe 'facile', ->
  it 'binds ids', ->
    template = '<div id="dog" />'
    data = {dog: 'woof'}
    result = facile(template, data)
    expect(result).toBe('<div id="dog">woof</div>')

  it 'binds arrays', ->
    template = '<div class="dog" />'
    data = {dog: ['woof', 'bark']}
    result = facile(template, data)
    expect(result).toBe('<div class="dog">woof</div><div class="dog">bark</div>')

  it 'binds nulls and removes element by id', ->
    template = '<div id="dog" />'
    data = {dog: null}
    result = facile(template, data)
    expect(result).toBe('')

  it 'binds nulls and removes element by class', ->
    template = '<div class="dog" />'
    data = {dog: null}
    result = facile(template, data)
    expect(result).toBe('')

  it 'binds objects', ->
    template = '<div id="dog" />'
    data = {dog: {value: 'woof', 'data-age': 3} }
    result = facile(template, data)
    expect(result).toBe('<div id="dog" data-age="3">woof</div>')
  
  it 'binds objects via classes', ->
    template = '<div class="dog" />'
    data = {dog: {value: 'woof', 'data-age': 3} }
    result = facile(template, data)
    expect(result).toBe('<div class="dog" data-age="3">woof</div>')

  it 'binds array of value objects', ->
    template = '<div class="dog" />'
    data =
      dog: [
        {value: 'woof', 'data-age': 3}
        {value: 'bark', 'data-peak': 27}
      ]
    result = facile(template, data)
    expect(result).toBe('<div class="dog" data-age="3">woof</div><div class="dog" data-peak="27">bark</div>')

  it 'looks for class if id does not exist', ->
    template = '<div class="dog" />'
    data = {dog: 'woof'}
    result = facile(template, data)
    expect(result).toBe('<div class="dog">woof</div>')

  it 'binds arrays of binding objects', ->
    template = '<div class="order"><div class="name" /></div>'
    data =
      order: [
        { name: 'cool order' }
        { name: 'lame order' }
      ]
    result = facile(template, data)
    expectedHtml = '<div class="order"><div class="name">cool order</div></div><div class="order"><div class="name">lame order</div></div>'
    expect(result).toBe(expectedHtml)

  it 'binds to table rows', ->
    template = '<table class="order"><thead><tr><td>Orders</td></tr></thead><tbody><tr><td class="name" /></tr></tbody></table>'
    data =
      order: [
        { name: 'cool order' }
        { name: 'lame order' }
      ]
    result = facile(template, data)
    expectedHtml = '<table class="order"><thead><tr><td>Orders</td></tr></thead><tbody><tr><td class="name">cool order</td></tr><tr><td class="name">lame order</td></tr></tbody></table>'
    expect(result).toBe(expectedHtml)

