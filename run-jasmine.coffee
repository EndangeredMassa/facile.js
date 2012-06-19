system = require 'system'

##
# Wait until the test condition is true or a timeout occurs. Useful for waiting
# on a server response or for a ui change (fadeIn, etc.) to occur.
#
# @param testFx javascript condition that evaluates to a boolean,
# it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
# as a callback function.
# @param onReady what to do when testFx condition is fulfilled,
# it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
# as a callback function.
# @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
##
waitFor = (testFx, onReady, timeOutMillis=3000) ->
    start = new Date().getTime()
    condition = false
    f = ->
        if (new Date().getTime() - start < timeOutMillis) and not condition
            # If not time-out yet and condition not yet fulfilled
            condition = (if typeof testFx is 'string' then eval testFx else testFx()) #< defensive code
        else
            if not condition
                # If condition still not fulfilled (timeout but condition is 'false')
                console.log "'waitFor()' timeout"
                phantom.exit(1)
            else
                # Condition fulfilled (timeout and/or condition is 'true')
                # console.log "'waitFor()' finished in #{new Date().getTime() - start}ms."
                if typeof onReady is 'string' then eval onReady else onReady() #< Do what it's supposed to do once the condition is fulfilled
                clearInterval interval #< Stop this interval
    interval = setInterval f, 100 #< repeat check every 100ms

if system.args.length isnt 2
    console.log 'Usage: run-jasmine.coffee URL'
    phantom.exit()

page = require('webpage').create()

# Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = (msg) ->
    console.log msg

page.open system.args[1], (status) ->
    if status isnt 'success'
        console.log 'Unable to access network'
        phantom.exit()
    else
        waitFor ->
            page.evaluate ->
                element = document.body.querySelector('.passingAlert, .resultsMenu')
                !!(element && element.innerText)
        , ->
            page.evaluate ->
                console.log('')
                console.log('')
                console.log '================================='

                queryDirectChildren = (rootElement, selector) ->
                  [].filter.call rootElement.querySelectorAll(selector), (element) ->
                    element.parentNode == rootElement

                queryDirectChild = (rootElement, selector) ->
                  elements = queryDirectChildren(rootElement, selector)
                  if elements.length > 0
                    elements[0]
                  else
                    null

                getDescription = (element) ->
                  description = element.querySelectorAll('.description')
                  description[0].innerText

                reportFailues = (failedSpecs, indent='') ->
                  for failedSpec in failedSpecs
                    console.log indent + getDescription(failedSpec)
                    message = queryDirectChild(failedSpec, '.messages')
                    if message
                      resultMessage = queryDirectChild(message, '.resultMessage')
                      if resultMessage
                        console.log '\033[31m' + indent + '  ' + resultMessage.innerText + '\033[39m'
                        console.log('')

                    nestedFailedSpecs = queryDirectChildren(failedSpec, '.failed')
                    reportFailues nestedFailedSpecs, indent + '  '

                reportSummary = (summary) ->
                  red = '\033[31m'
                  green = '\033[39m'
                  if summary.className.indexOf('passing') > -1
                    console.log green + summary.innerText
                  else
                    console.log red + summary.innerText + green

                failures = document.body.querySelectorAll('.specDetail.failed')
                summary = document.body.querySelectorAll('.passingAlert, .resultsMenu')[0]
                reportFailues failures
                reportSummary summary


            phantom.exit()
