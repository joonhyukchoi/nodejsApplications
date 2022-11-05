const _ = require('underscore')

[1, 2, 3].forEach(alert)

function splat(fun) {
  return function(array) {
    return fun.apply(null, array)
  }
}

var addArrayelements = splat(function(x, y) {return x + y})

addArrayelements([1, 2])

function unsplat(fun) {
  return function() {
    return fun.call(null, _.toArray(arguments))
  }
}

var joinElements = unsplat(function(array) {return array.join(' ')})

joinElements(1, 2, 3)