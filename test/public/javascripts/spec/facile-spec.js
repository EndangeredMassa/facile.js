(function() {

  (function(facile) {
    return describe('facile', function() {
      describe('binds data', function() {
        it('to ids', function() {
          var data, result, template;
          template = '<div id="dog" />';
          data = {
            dog: 'woof'
          };
          result = facile(template, data);
          return expect(result).toBe('<div id="dog">woof</div>');
        });
        it('even if it is a boolean', function() {
          var data, result, template;
          template = '<td class="dog" />';
          data = {
            dog: true
          };
          result = facile(template, data);
          return expect(result).toBe('<td class="dog">true</td>');
        });
        it('to classes if id does not exist', function() {
          var data, result, template;
          template = '<div class="dog" />';
          data = {
            dog: 'woof'
          };
          result = facile(template, data);
          return expect(result).toBe('<div class="dog">woof</div>');
        });
        it('of binding objects', function() {
          var data, expectedHtml, result, template;
          template = '<div id="orders"><div class="order"><div class="name" /></div></div>';
          data = {
            orders: [
              {
                name: 'cool order'
              }, {
                name: 'lame order'
              }
            ]
          };
          result = facile(template, data);
          expectedHtml = '<div id="orders"><div class="order"><div class="name">cool order</div></div><div class="order"><div class="name">lame order</div></div></div>';
          return expect(result).toBe(expectedHtml);
        });
        return it('to tables as rows', function() {
          var data, expectedHtml, result, template;
          template = '<table class="order"><thead><tr><td>Orders</td></tr></thead><tbody><tr><td class="name" /></tr></tbody></table>';
          data = {
            order: [
              {
                name: 'cool order'
              }, {
                name: 'lame order'
              }
            ]
          };
          result = facile(template, data);
          expectedHtml = '<table class="order"><thead><tr><td>Orders</td></tr></thead><tbody><tr><td class="name">cool order</td></tr><tr><td class="name">lame order</td></tr></tbody></table>';
          return expect(result).toBe(expectedHtml);
        });
      });
      describe('binds objects', function() {
        it('to ids', function() {
          var data, result, template;
          template = '<div id="dog" />';
          data = {
            dog: {
              content: 'woof',
              'data-age': 3
            }
          };
          result = facile(template, data);
          return expect(result).toBe('<div id="dog" data-age="3">woof</div>');
        });
        it('to classes', function() {
          var data, result, template;
          template = '<div class="dog" />';
          data = {
            dog: {
              content: 'woof',
              'data-age': 3
            }
          };
          result = facile(template, data);
          return expect(result).toBe('<div class="dog" data-age="3">woof</div>');
        });
        it('to ids with attribute syntax', function() {
          var data, result, template;
          template = '<div id="dog" />';
          data = {
            dog: 'woof',
            'dog@data-age': 3
          };
          result = facile(template, data);
          return expect(result).toBe('<div id="dog" data-age="3">woof</div>');
        });
        it('to classes with attribute syntaxt', function() {
          var data, result, template;
          template = '<div class="dog" />';
          data = {
            dog: 'woof',
            'dog@data-age': 3
          };
          result = facile(template, data);
          return expect(result).toBe('<div class="dog" data-age="3">woof</div>');
        });
        it('that are nested', function() {
          var data, expectedHtml, result, template;
          template = '<div class="order"><div class="name"><div class="place" /></div></div>';
          data = {
            order: [
              {
                name: {
                  content: 'over there',
                  place: 'cool order'
                }
              }
            ]
          };
          result = facile(template, data);
          expectedHtml = '<div class="order"><div class="name" place="cool order">over there</div></div>';
          return expect(result).toBe(expectedHtml);
        });
        it('fills value for input tags by default', function() {
          var data, expectedHtml, result, template;
          template = '<div class="dog"><input class="name"></div>';
          data = {
            dog: [
              {
                name: 'Rex'
              }
            ]
          };
          result = facile(template, data).replace(/\/>/, ">");
          expectedHtml = '<div class="dog"><input class="name" value="Rex"></div>';
          return expect(result).toBe(expectedHtml);
        });
        it('selects an option for select tags with a value', function() {
          var data, expectedHtml, result, template;
          template = '<select class="dog"><option value="Rex Maximus"></option></select>';
          data = {
            'dog@value': 'Rex Maximus'
          };
          result = facile(template, data);
          expectedHtml = '<select class="dog"><option value="Rex Maximus" selected="selected"></option></select>';
          return expect(result).toBe(expectedHtml);
        });
        it('checks a checkbox given a boolean value', function() {
          var data, expectedHtml, result, template;
          template = '<div class="dog"><input type="checkbox" class="name"></div>';
          data = {
            dog: [
              {
                name: true
              }
            ]
          };
          result = facile(template, data).replace(/\/>/, ">");
          expectedHtml = '<div class="dog"><input type="checkbox" class="name" checked="checked"></div>';
          return expect(result).toBe(expectedHtml);
        });
        it('selects an option for select tags if its value is not an object', function() {
          var data, expectedHtml, result, template;
          template = '<select class="dog"><option value="Rex Maximus"></option></select>';
          data = {
            'dog': 'Rex Maximus'
          };
          result = facile(template, data);
          expectedHtml = '<select class="dog"><option value="Rex Maximus" selected="selected"></option></select>';
          return expect(result).toBe(expectedHtml);
        });
        return it('binds a select tag normally if its value is an object', function() {
          var data, expectedHtml, result, template;
          template = '<select class="dog"><option class="option"></option></select>';
          data = {
            'dog': [
              {
                option: 'Rex Maximus'
              }, {
                option: 'Mr. Monster'
              }
            ]
          };
          result = facile(template, data);
          expectedHtml = '<select class="dog"><option class="option" value="Rex Maximus"></option><option class="option" value="Mr. Monster"></option></select>';
          return expect(result).toBe(expectedHtml);
        });
      });
      describe('binding arrays', function() {
        xit('binds to class and id');
        it('of binding objects', function() {
          var data, result, template;
          template = '<div id="dogs"><div class="dog"><div class="speak" /></div></div>';
          data = {
            dogs: [
              {
                speak: 'woof'
              }, {
                speak: 'bark'
              }
            ]
          };
          result = facile(template, data);
          return expect(result).toBe('<div id="dogs"><div class="dog"><div class="speak">woof</div></div><div class="dog"><div class="speak">bark</div></div></div>');
        });
        return it('of content objects', function() {
          var data, result, template;
          template = '<div id="dogs"><div class="dog" /></div>';
          data = {
            dogs: [
              {
                dog: {
                  content: 'woof',
                  'data-age': 3
                }
              }, {
                dog: {
                  content: 'bark',
                  'data-peak': 27
                }
              }
            ]
          };
          result = facile(template, data);
          return expect(result).toBe('<div id="dogs"><div class="dog" data-age="3">woof</div><div class="dog" data-peak="27">bark</div></div>');
        });
      });
      describe('binds nulls', function() {
        it('by removing elements by id', function() {
          var data, result, template;
          template = '<div id="dog" />';
          data = {
            dog: null
          };
          result = facile(template, data);
          return expect(result).toBe('');
        });
        it('by removing elements by class', function() {
          var data, result, template;
          template = '<div class="dog" />';
          data = {
            dog: null
          };
          result = facile(template, data);
          return expect(result).toBe('');
        });
        return it('when they are nested', function() {
          var data, expectedHtml, result, template;
          template = '<div class="order"><div class="name"><div class="place" /></div></div>';
          data = {
            order: [
              {
                name: {
                  place: null
                }
              }
            ]
          };
          result = facile(template, data);
          expectedHtml = '<div class="order"><div class="name"></div></div>';
          return expect(result).toBe(expectedHtml);
        });
      });
      return describe('appends classes', function() {
        it('to objects bound via classes', function() {
          var data, result, template;
          template = '<div class="dog" />';
          data = {
            dog: {
              content: 'woof',
              'class': 'spaniel'
            }
          };
          result = facile(template, data);
          return expect(result).toBe('<div class="dog spaniel">woof</div>');
        });
        it('to objects bound via ids', function() {
          var data, result, template;
          template = '<div id="dog" />';
          data = {
            dog: {
              content: 'woof',
              'class': 'spaniel'
            }
          };
          result = facile(template, data);
          return expect(result).toBe('<div id="dog" class="spaniel">woof</div>');
        });
        return it('ignores empty class values', function() {
          var data, result, template;
          template = '<div class="dog" />';
          data = {
            dog: {
              content: 'woof',
              'class': ''
            }
          };
          result = facile(template, data);
          return expect(result).toBe('<div class="dog">woof</div>');
        });
      });
    });
  }).call(this, this.facile || require("../facile"));

}).call(this);
