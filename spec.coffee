describe 'facile', ->
  describe 'binds data', ->
    it 'to ids', ->
      template = '<div id="dog" />'
      data = {dog: 'woof'}
      result = facile(template, data)
      expect(result).toBe('<div id="dog">woof</div>')

    it 'to classes if id does not exist', ->
      template = '<div class="dog" />'
      data = {dog: 'woof'}
      result = facile(template, data)
      expect(result).toBe('<div class="dog">woof</div>')

    it 'of binding objects', ->
      template = '<div class="order"><div class="name" /></div>'
      data =
        order: [
          { name: 'cool order' }
          { name: 'lame order' }
        ]
      result = facile(template, data)
      expectedHtml = '<div class="order"><div class="name">cool order</div></div><div class="order"><div class="name">lame order</div></div>'
      expect(result).toBe(expectedHtml)

    it 'to tables as rows', ->
      template = '<table class="order"><thead><tr><td>Orders</td></tr></thead><tbody><tr><td class="name" /></tr></tbody></table>'
      data =
        order: [
          { name: 'cool order' }
          { name: 'lame order' }
        ]
      result = facile(template, data)
      expectedHtml = '<table class="order"><thead><tr><td>Orders</td></tr></thead><tbody><tr><td class="name">cool order</td></tr><tr><td class="name">lame order</td></tr></tbody></table>'
      expect(result).toBe(expectedHtml)

  describe 'binds objects', ->
    it 'to ids', ->
      template = '<div id="dog" />'
      data = {dog: {content: 'woof', 'data-age': 3} }
      result = facile(template, data)
      expect(result).toBe('<div id="dog" data-age="3">woof</div>')

    it 'to classes', ->
      template = '<div class="dog" />'
      data = {dog: {content: 'woof', 'data-age': 3} }
      result = facile(template, data)
      expect(result).toBe('<div class="dog" data-age="3">woof</div>')

    it 'that are nested', ->
      template = '<div class="order"><div class="name"><div class="place" /></div></div>'
      data =
        order: [
          name:
            content: 'over there'
            place: 'cool order'
        ]
      result = facile(template, data)
      expectedHtml = '<div class="order"><div class="name" place="cool order">over there</div></div>'
      expect(result).toBe(expectedHtml)

  describe 'binding arrays', ->
    it 'of simple values', ->
      template = '<div class="dog" />'
      data = {dog: ['woof', 'bark']}
      result = facile(template, data)
      expect(result).toBe('<div class="dog">woof</div><div class="dog">bark</div>')

    it 'of content objects', ->
      template = '<div class="dog" />'
      data =
        dog: [
          {content: 'woof', 'data-age': 3}
          {content: 'bark', 'data-peak': 27}
        ]
      result = facile(template, data)
      expect(result).toBe('<div class="dog" data-age="3">woof</div><div class="dog" data-peak="27">bark</div>')

  describe 'binds nulls', ->
    it 'by removing elements by id', ->
      template = '<div id="dog" />'
      data = {dog: null}
      result = facile(template, data)
      expect(result).toBe('')

    it 'by removing elements by class', ->
      template = '<div class="dog" />'
      data = {dog: null}
      result = facile(template, data)
      expect(result).toBe('')

    it 'when they are nested', ->
      template = '<div class="order"><div class="name"><div class="place" /></div></div>'
      data =
        order: [
          name:
            place: null
        ]
      result = facile(template, data)
      expectedHtml = '<div class="order"><div class="name"></div></div>'
      expect(result).toBe(expectedHtml)

  describe 'appends classes', ->
    it 'to objects bound via classes', ->
      template = '<div class="dog" />'
      data = {dog: {content: 'woof', 'class': 'spaniel'} }
      result = facile(template, data)
      expect(result).toBe('<div class="dog spaniel">woof</div>')

    it 'to objects bound via ids', ->
      template = '<div id="dog" />'
      data = {dog: {content: 'woof', 'class': 'spaniel'} }
      result = facile(template, data)
      expect(result).toBe('<div id="dog" class="spaniel">woof</div>')

