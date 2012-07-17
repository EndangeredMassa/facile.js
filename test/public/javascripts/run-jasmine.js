(function() {
  var page, system, waitFor;

  system = require('system');

  waitFor = function(testFx, onReady, timeOutMillis) {
    var condition, f, interval, start;
    if (timeOutMillis == null) timeOutMillis = 3000;
    start = new Date().getTime();
    condition = false;
    f = function() {
      if ((new Date().getTime() - start < timeOutMillis) && !condition) {
        return condition = (typeof testFx === 'string' ? eval(testFx) : testFx());
      } else {
        if (!condition) {
          console.log("'waitFor()' timeout");
          return phantom.exit(1);
        } else {
          if (typeof onReady === 'string') {
            eval(onReady);
          } else {
            onReady();
          }
          return clearInterval(interval);
        }
      }
    };
    return interval = setInterval(f, 100);
  };

  if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.coffee URL');
    phantom.exit();
  }

  page = require('webpage').create();

  page.onConsoleMessage = function(msg) {
    return console.log(msg);
  };

  page.open(system.args[1], function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
      return phantom.exit();
    } else {
      return waitFor(function() {
        return page.evaluate(function() {
          var element;
          element = document.body.querySelector('.passingAlert, .resultsMenu');
          return !!(element && element.innerText);
        });
      }, function() {
        page.evaluate(function() {
          var failures, getDescription, queryDirectChild, queryDirectChildren, reportFailues, reportSummary, summary;
          console.log('');
          console.log('');
          console.log('=================================');
          queryDirectChildren = function(rootElement, selector) {
            return [].filter.call(rootElement.querySelectorAll(selector), function(element) {
              return element.parentNode === rootElement;
            });
          };
          queryDirectChild = function(rootElement, selector) {
            var elements;
            elements = queryDirectChildren(rootElement, selector);
            if (elements.length > 0) {
              return elements[0];
            } else {
              return null;
            }
          };
          getDescription = function(element) {
            var description;
            description = element.querySelectorAll('.description');
            return description[0].innerText;
          };
          reportFailues = function(failedSpecs, indent) {
            var failedSpec, message, nestedFailedSpecs, resultMessage, _i, _len, _results;
            if (indent == null) indent = '';
            _results = [];
            for (_i = 0, _len = failedSpecs.length; _i < _len; _i++) {
              failedSpec = failedSpecs[_i];
              console.log(indent + getDescription(failedSpec));
              message = queryDirectChild(failedSpec, '.messages');
              if (message) {
                resultMessage = queryDirectChild(message, '.resultMessage');
                if (resultMessage) {
                  console.log('\033[31m' + indent + '  ' + resultMessage.innerText + '\033[39m');
                  console.log('');
                }
              }
              nestedFailedSpecs = queryDirectChildren(failedSpec, '.failed');
              _results.push(reportFailues(nestedFailedSpecs, indent + '  '));
            }
            return _results;
          };
          reportSummary = function(summary) {
            var green, red;
            red = '\033[31m';
            green = '\033[39m';
            if (summary.className.indexOf('passing') > -1) {
              return console.log(green + summary.innerText);
            } else {
              return console.log(red + summary.innerText + green);
            }
          };
          failures = document.body.querySelectorAll('.specDetail.failed');
          summary = document.body.querySelectorAll('.passingAlert, .resultsMenu')[0];
          reportFailues(failures);
          return reportSummary(summary);
        });
        return phantom.exit();
      });
    }
  });

}).call(this);
