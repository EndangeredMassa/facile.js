# Facile

Facile is a convention-based template engine that can be executed
either in the browser (using jQuery or zepto) or on the server
(using cheerio). While other template systems like Mustache give the
developer syntax for explicit conditionals, enumerations and data 
bindings, Facile uses simple conventions to achieve the same goals 
with less code.

## Installation

If you want to use Facile with Node.js, install it using `npm`:

```bash
npm install facile
```

To use Facile in the browser, either copy the `facile.coffee` file
or the compiled `test/public/javascripts/facile.js` file into your
project.

## Usage

The facile package is a single function that accepts a `template` string
and a `data` object:

```javascript
var facile = require("facile"), // only needed in Node.js
    template = "...",
    data = {...},
    output = facile(template, data);
```

### Data Binding by Ids and Classes

Facile will look for DOM ids and classes that match the keys in your
data object and set the DOM elements' text to the data values:

```javascript
var template = '<div id="dog"></div><div class="cat"></div>',
    data = {dog: "woof", cat: "meow"};
facile(template, data);
// returns '<div id="dog">woof</div><div class="cat">meow</div>'
```

### Looping Over Collections

When a value in the data object is an array, Facile will find the
container DOM element that matches the data key and render its
contents for each item in the array.

```javascript
var template = '<ul id="users"><li class="name"></li></ul>',
    data = {users: [
      {name: "Moe"}, 
      {name: "Larry"},
      {name: "Curly"}
    ]};
facile(template, data);
// returns:
// <ul id="users">
//   <li class="name">Moe</li>
//   <li class="name">Larry</li>
//   <li class="name">Curly</li>
// </ul>
```

If you are binding an array of data to a `<table>` element, Facile will
use the content of the table's `<tbody>` as the template for the data object.
This allows you to setup a `<thead>` without duplicating it.

```javascript
var template = '<table id="users">' +
               '  <thead>' +
               '    <tr><th>Name</th></tr>' +
               '  </thead>' +
               '  <tbody>' +
               '    <tr><td class="name"></td></tr>' +
               '  </tbody>' +
               '</table>',
    data = {users: [
      {name: "Moe"}, 
      {name: "Larry"},
      {name: "Curly"}
    ]};
facile(template, data);
// returns:
// <table id="users">
//   <thead>
//     <tr><th>Name</th></tr>
//   </thead>
//   <tbody>
//     <tr><td class="name">Moe</td></tr>
//     <tr><td class="name">Larry</td></tr>
//     <tr><td class="name">Curly</td></tr>
//   </tbody>
// </table>
```

### Removing Elements

If the data object has a `null` value, the corresponding DOM element
will be removed.

```javascript
var template = '<p>Hello!</p><p class="impolite">Take a hike, guy.</p>',
    data = {impolite: null};
facile(template, data);
// returns "<p>Hello!</p>"
```

### Setting DOM Attributes

There are two ways to set DOM attributes on elements using Facile.
First, if a value in the data object is an object, Facile will treat 
the keys as attribute names for the matching DOM element. *NOTE:* 
the `content` key is required to trigger this behavior. It is also 
special in that it updates the content of the element rather than 
setting a `content` attribute.

```javascript
var template = '<div id="dog" />',
    data = {dog: {content: 'woof', 'data-age': 3} };
facile(template, data);
// returns '<div id="dog" data-age="3">woof</div>'
```

The second way is to name a key in the data object using the convention
`id-or-class@attribute`.

```javascript
var template = '<div id="dog" />',
    data = {dog: 'woof', 'dog@data-age': 3};
facile(template, data);
// returns '<div id="dog" data-age="3">woof</div>'
```

### Using Facile with Express

Facile works out of the box as a render engine in the Express framework 
in Node.js. If you are suffixing your view files with `.facile` then you
simply need to add this line to your Express app:

```javascript
app.set("view engine", "facile");
```

If you would rather name your view files with a `.html` suffix, add these
lines instead:

```javascript
app.set("view engine", "html");
app.register(".html", require(facile));
```

## Running the Tests

1. Install `node` and `npm`.
2. Run `npm install` to the dependencies
3. Run `npm test` to run the specs in Node.js
4. Run `./coffee` to watch/compile the CoffeeScripts
5. Run `node test` to run Jasmine test server
6. Visit [http://localhost:5000](http://localhost:5000) to see the tests run in the browser.

