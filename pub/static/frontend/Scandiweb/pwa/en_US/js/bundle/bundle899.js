require.config({"config": {
        "jsbuild":{"knockoutjs/knockout-es5.js":"/*!\n * Knockout ES5 plugin - https://github.com/SteveSanderson/knockout-es5\n * Copyright (c) Steve Sanderson\n * MIT license\n */\n\n(function(global, undefined) {\n  'use strict';\n\n  var ko;\n\n  // Model tracking\n  // --------------\n  //\n  // This is the central feature of Knockout-ES5. We augment model objects by converting properties\n  // into ES5 getter/setter pairs that read/write an underlying Knockout observable. This means you can\n  // use plain JavaScript syntax to read/write the property while still getting the full benefits of\n  // Knockout's automatic dependency detection and notification triggering.\n  //\n  // For comparison, here's Knockout ES3-compatible syntax:\n  //\n  //     var firstNameLength = myModel.user().firstName().length; // Read\n  //     myModel.user().firstName('Bert'); // Write\n  //\n  // ... versus Knockout-ES5 syntax:\n  //\n  //     var firstNameLength = myModel.user.firstName.length; // Read\n  //     myModel.user.firstName = 'Bert'; // Write\n\n  // `ko.track(model)` converts each property on the given model object into a getter/setter pair that\n  // wraps a Knockout observable. Optionally specify an array of property names to wrap; otherwise we\n  // wrap all properties. If any of the properties are already observables, we replace them with\n  // ES5 getter/setter pairs that wrap your original observable instances. In the case of readonly\n  // ko.computed properties, we simply do not define a setter (so attempted writes will be ignored,\n  // which is how ES5 readonly properties normally behave).\n  //\n  // By design, this does *not* recursively walk child object properties, because making literally\n  // everything everywhere independently observable is usually unhelpful. When you do want to track\n  // child object properties independently, define your own class for those child objects and put\n  // a separate ko.track call into its constructor --- this gives you far more control.\n  /**\n   * @param {object} obj\n   * @param {object|array.<string>} propertyNamesOrSettings\n   * @param {boolean} propertyNamesOrSettings.deep Use deep track.\n   * @param {array.<string>} propertyNamesOrSettings.fields Array of property names to wrap.\n   * todo: @param {array.<string>} propertyNamesOrSettings.exclude Array of exclude property names to wrap.\n   * todo: @param {function(string, *):boolean} propertyNamesOrSettings.filter Function to filter property \n   *   names to wrap. A function that takes ... params\n   * @return {object}\n   */\n  function track(obj, propertyNamesOrSettings) {\n    if (!obj || typeof obj !== 'object') {\n      throw new Error('When calling ko.track, you must pass an object as the first parameter.');\n    }\n\n    var propertyNames;\n\n    if ( isPlainObject(propertyNamesOrSettings) ) {\n      // defaults\n      propertyNamesOrSettings.deep = propertyNamesOrSettings.deep || false;\n      propertyNamesOrSettings.fields = propertyNamesOrSettings.fields || Object.getOwnPropertyNames(obj);\n      propertyNamesOrSettings.lazy = propertyNamesOrSettings.lazy || false;\n\n      wrap(obj, propertyNamesOrSettings.fields, propertyNamesOrSettings);\n    } else {\n      propertyNames = propertyNamesOrSettings || Object.getOwnPropertyNames(obj);\n      wrap(obj, propertyNames, {});\n    }\n\n    return obj;\n  }\n\n  // fix for ie\n  var rFunctionName = /^function\\s*([^\\s(]+)/;\n  function getFunctionName( ctor ){\n    if (ctor.name) {\n      return ctor.name;\n    }\n    return (ctor.toString().trim().match( rFunctionName ) || [])[1];\n  }\n\n  function canTrack(obj) {\n    return obj && typeof obj === 'object' && getFunctionName(obj.constructor) === 'Object';\n  }\n\n  function createPropertyDescriptor(originalValue, prop, map) {\n    var isObservable = ko.isObservable(originalValue);\n    var isArray = !isObservable && Array.isArray(originalValue);\n    var observable = isObservable ? originalValue\n        : isArray ? ko.observableArray(originalValue)\n        : ko.observable(originalValue);\n\n    map[prop] = function () { return observable; };\n\n    // add check in case the object is already an observable array\n    if (isArray || (isObservable && 'push' in observable)) {\n      notifyWhenPresentOrFutureArrayValuesMutate(ko, observable);\n    }\n\n    return {\n      configurable: true,\n      enumerable: true,\n      get: observable,\n      set: ko.isWriteableObservable(observable) ? observable : undefined\n    };\n  }\n\n  function createLazyPropertyDescriptor(originalValue, prop, map) {\n    if (ko.isObservable(originalValue)) {\n      // no need to be lazy if we already have an observable\n      return createPropertyDescriptor(originalValue, prop, map);\n    }\n\n    var observable;\n\n    function getOrCreateObservable(value, writing) {\n      if (observable) {\n        return writing ? observable(value) : observable;\n      }\n\n      if (Array.isArray(value)) {\n        observable = ko.observableArray(value);\n        notifyWhenPresentOrFutureArrayValuesMutate(ko, observable);\n        return observable;\n      }\n\n      return (observable = ko.observable(value));\n    }\n\n    map[prop] = function () { return getOrCreateObservable(originalValue); };\n    return {\n      configurable: true,\n      enumerable: true,\n      get: function () { return getOrCreateObservable(originalValue)(); },\n      set: function (value) { getOrCreateObservable(value, true); }\n    };\n  }\n\n  function wrap(obj, props, options) {\n    if (!props.length) {\n      return;\n    }\n\n    var allObservablesForObject = getAllObservablesForObject(obj, true);\n    var descriptors = {};\n\n    props.forEach(function (prop) {\n      // Skip properties that are already tracked\n      if (prop in allObservablesForObject) {\n        return;\n      }\n\n      // Skip properties where descriptor can't be redefined\n      if (Object.getOwnPropertyDescriptor(obj, prop).configurable === false){\n        return;\n      }\n\n      var originalValue = obj[prop];\n      descriptors[prop] = (options.lazy ? createLazyPropertyDescriptor : createPropertyDescriptor)\n        (originalValue, prop, allObservablesForObject);\n\n      if (options.deep && canTrack(originalValue)) {\n        wrap(originalValue, Object.keys(originalValue), options);\n      }\n    });\n\n    Object.defineProperties(obj, descriptors);\n  }\n\n  function isPlainObject( obj ){\n    return !!obj && typeof obj === 'object' && obj.constructor === Object;\n  }\n\n  // Lazily created by `getAllObservablesForObject` below. Has to be created lazily because the\n  // WeakMap factory isn't available until the module has finished loading (may be async).\n  var objectToObservableMap;\n\n  // Gets or creates the hidden internal key-value collection of observables corresponding to\n  // properties on the model object.\n  function getAllObservablesForObject(obj, createIfNotDefined) {\n    if (!objectToObservableMap) {\n      objectToObservableMap = weakMapFactory();\n    }\n\n    var result = objectToObservableMap.get(obj);\n    if (!result && createIfNotDefined) {\n      result = {};\n      objectToObservableMap.set(obj, result);\n    }\n    return result;\n  }\n\n  // Removes the internal references to observables mapped to the specified properties\n  // or the entire object reference if no properties are passed in. This allows the\n  // observables to be replaced and tracked again.\n  function untrack(obj, propertyNames) {\n    if (!objectToObservableMap) {\n      return;\n    }\n\n    if (arguments.length === 1) {\n      objectToObservableMap['delete'](obj);\n    } else {\n      var allObservablesForObject = getAllObservablesForObject(obj, false);\n      if (allObservablesForObject) {\n        propertyNames.forEach(function(propertyName) {\n          delete allObservablesForObject[propertyName];\n        });\n      }\n    }\n  }\n\n  // Computed properties\n  // -------------------\n  //\n  // The preceding code is already sufficient to upgrade ko.computed model properties to ES5\n  // getter/setter pairs (or in the case of readonly ko.computed properties, just a getter).\n  // These then behave like a regular property with a getter function, except they are smarter:\n  // your evaluator is only invoked when one of its dependencies changes. The result is cached\n  // and used for all evaluations until the next time a dependency changes).\n  //\n  // However, instead of forcing developers to declare a ko.computed property explicitly, it's\n  // nice to offer a utility function that declares a computed getter directly.\n\n  // Implements `ko.defineProperty`\n  function defineComputedProperty(obj, propertyName, evaluatorOrOptions) {\n    var ko = this,\n      computedOptions = { owner: obj, deferEvaluation: true };\n\n    if (typeof evaluatorOrOptions === 'function') {\n      computedOptions.read = evaluatorOrOptions;\n    } else {\n      if ('value' in evaluatorOrOptions) {\n        throw new Error('For ko.defineProperty, you must not specify a \"value\" for the property. ' +\n                        'You must provide a \"get\" function.');\n      }\n\n      if (typeof evaluatorOrOptions.get !== 'function') {\n        throw new Error('For ko.defineProperty, the third parameter must be either an evaluator function, ' +\n                        'or an options object containing a function called \"get\".');\n      }\n\n      computedOptions.read = evaluatorOrOptions.get;\n      computedOptions.write = evaluatorOrOptions.set;\n    }\n\n    obj[propertyName] = ko.computed(computedOptions);\n    track.call(ko, obj, [propertyName]);\n    return obj;\n  }\n\n  // Array handling\n  // --------------\n  //\n  // Arrays are special, because unlike other property types, they have standard mutator functions\n  // (`push`/`pop`/`splice`/etc.) and it's desirable to trigger a change notification whenever one of\n  // those mutator functions is invoked.\n  //\n  // Traditionally, Knockout handles this by putting special versions of `push`/`pop`/etc. on observable\n  // arrays that mutate the underlying array and then trigger a notification. That approach doesn't\n  // work for Knockout-ES5 because properties now return the underlying arrays, so the mutator runs\n  // in the context of the underlying array, not any particular observable:\n  //\n  //     // Operates on the underlying array value\n  //     myModel.someCollection.push('New value');\n  //\n  // To solve this, Knockout-ES5 detects array values, and modifies them as follows:\n  //  1. Associates a hidden subscribable with each array instance that it encounters\n  //  2. Intercepts standard mutators (`push`/`pop`/etc.) and makes them trigger the subscribable\n  // Then, for model properties whose values are arrays, the property's underlying observable\n  // subscribes to the array subscribable, so it can trigger a change notification after mutation.\n\n  // Given an observable that underlies a model property, watch for any array value that might\n  // be assigned as the property value, and hook into its change events\n  function notifyWhenPresentOrFutureArrayValuesMutate(ko, observable) {\n    var watchingArraySubscription = null;\n    ko.computed(function () {\n      // Unsubscribe to any earlier array instance\n      if (watchingArraySubscription) {\n        watchingArraySubscription.dispose();\n        watchingArraySubscription = null;\n      }\n\n      // Subscribe to the new array instance\n      var newArrayInstance = observable();\n      if (newArrayInstance instanceof Array) {\n        watchingArraySubscription = startWatchingArrayInstance(ko, observable, newArrayInstance);\n      }\n    });\n  }\n\n  // Listens for array mutations, and when they happen, cause the observable to fire notifications.\n  // This is used to make model properties of type array fire notifications when the array changes.\n  // Returns a subscribable that can later be disposed.\n  function startWatchingArrayInstance(ko, observable, arrayInstance) {\n    var subscribable = getSubscribableForArray(ko, arrayInstance);\n    return subscribable.subscribe(observable);\n  }\n\n  // Lazily created by `getSubscribableForArray` below. Has to be created lazily because the\n  // WeakMap factory isn't available until the module has finished loading (may be async).\n  var arraySubscribablesMap;\n\n  // Gets or creates a subscribable that fires after each array mutation\n  function getSubscribableForArray(ko, arrayInstance) {\n    if (!arraySubscribablesMap) {\n      arraySubscribablesMap = weakMapFactory();\n    }\n\n    var subscribable = arraySubscribablesMap.get(arrayInstance);\n    if (!subscribable) {\n      subscribable = new ko.subscribable();\n      arraySubscribablesMap.set(arrayInstance, subscribable);\n\n      var notificationPauseSignal = {};\n      wrapStandardArrayMutators(arrayInstance, subscribable, notificationPauseSignal);\n      addKnockoutArrayMutators(ko, arrayInstance, subscribable, notificationPauseSignal);\n    }\n\n    return subscribable;\n  }\n\n  // After each array mutation, fires a notification on the given subscribable\n  function wrapStandardArrayMutators(arrayInstance, subscribable, notificationPauseSignal) {\n    ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(fnName) {\n      var origMutator = arrayInstance[fnName];\n      arrayInstance[fnName] = function() {\n        var result = origMutator.apply(this, arguments);\n        if (notificationPauseSignal.pause !== true) {\n          subscribable.notifySubscribers(this);\n        }\n        return result;\n      };\n    });\n  }\n\n  // Adds Knockout's additional array mutation functions to the array\n  function addKnockoutArrayMutators(ko, arrayInstance, subscribable, notificationPauseSignal) {\n    ['remove', 'removeAll', 'destroy', 'destroyAll', 'replace'].forEach(function(fnName) {\n      // Make it a non-enumerable property for consistency with standard Array functions\n      Object.defineProperty(arrayInstance, fnName, {\n        enumerable: false,\n        value: function() {\n          var result;\n\n          // These additional array mutators are built using the underlying push/pop/etc.\n          // mutators, which are wrapped to trigger notifications. But we don't want to\n          // trigger multiple notifications, so pause the push/pop/etc. wrappers and\n          // delivery only one notification at the end of the process.\n          notificationPauseSignal.pause = true;\n          try {\n            // Creates a temporary observableArray that can perform the operation.\n            result = ko.observableArray.fn[fnName].apply(ko.observableArray(arrayInstance), arguments);\n          }\n          finally {\n            notificationPauseSignal.pause = false;\n          }\n          subscribable.notifySubscribers(arrayInstance);\n          return result;\n        }\n      });\n    });\n  }\n\n  // Static utility functions\n  // ------------------------\n  //\n  // Since Knockout-ES5 sets up properties that return values, not observables, you can't\n  // trivially subscribe to the underlying observables (e.g., `someProperty.subscribe(...)`),\n  // or tell them that object values have mutated, etc. To handle this, we set up some\n  // extra utility functions that can return or work with the underlying observables.\n\n  // Returns the underlying observable associated with a model property (or `null` if the\n  // model or property doesn't exist, or isn't associated with an observable). This means\n  // you can subscribe to the property, e.g.:\n  //\n  //     ko.getObservable(model, 'propertyName')\n  //       .subscribe(function(newValue) { ... });\n  function getObservable(obj, propertyName) {\n    if (!obj || typeof obj !== 'object') {\n      return null;\n    }\n\n    var allObservablesForObject = getAllObservablesForObject(obj, false);\n    if (allObservablesForObject && propertyName in allObservablesForObject) {\n      return allObservablesForObject[propertyName]();\n    }\n\n    return null;\n  }\n  \n  // Returns a boolean indicating whether the property on the object has an underlying\n  // observables. This does the check in a way not to create an observable if the\n  // object was created with lazily created observables\n  function isTracked(obj, propertyName) {\n    if (!obj || typeof obj !== 'object') {\n      return false;\n    }\n    \n    var allObservablesForObject = getAllObservablesForObject(obj, false);\n    return !!allObservablesForObject && propertyName in allObservablesForObject;\n  }\n\n  // Causes a property's associated observable to fire a change notification. Useful when\n  // the property value is a complex object and you've modified a child property.\n  function valueHasMutated(obj, propertyName) {\n    var observable = getObservable(obj, propertyName);\n\n    if (observable) {\n      observable.valueHasMutated();\n    }\n  }\n\n  // Module initialisation\n  // ---------------------\n  //\n  // When this script is first evaluated, it works out what kind of module loading scenario\n  // it is in (Node.js or a browser `<script>` tag), stashes a reference to its dependencies\n  // (currently that's just the WeakMap shim), and then finally attaches itself to whichever\n  // instance of Knockout.js it can find.\n\n  // A function that returns a new ES6-compatible WeakMap instance (using ES5 shim if needed).\n  // Instantiated by prepareExports, accounting for which module loader is being used.\n  var weakMapFactory;\n\n  // Extends a Knockout instance with Knockout-ES5 functionality\n  function attachToKo(ko) {\n    ko.track = track;\n    ko.untrack = untrack;\n    ko.getObservable = getObservable;\n    ko.valueHasMutated = valueHasMutated;\n    ko.defineProperty = defineComputedProperty;\n\n    // todo: test it, maybe added it to ko. directly\n    ko.es5 = {\n      getAllObservablesForObject: getAllObservablesForObject,\n      notifyWhenPresentOrFutureArrayValuesMutate: notifyWhenPresentOrFutureArrayValuesMutate,\n      isTracked: isTracked\n    };\n  }\n\n  // Determines which module loading scenario we're in, grabs dependencies, and attaches to KO\n  function prepareExports() {\n    if (typeof exports === 'object' && typeof module === 'object') {\n      // Node.js case - load KO and WeakMap modules synchronously\n      ko = require('knockout');\n      var WM = require('../lib/weakmap');\n      attachToKo(ko);\n      weakMapFactory = function() { return new WM(); };\n      module.exports = ko;\n    } else if (typeof define === 'function' && define.amd) {\n      define(['knockout'], function(koModule) {\n        ko = koModule;\n        attachToKo(koModule);\n        weakMapFactory = function() { return new global.WeakMap(); };\n        return koModule;\n      });\n    } else if ('ko' in global) {\n      // Non-module case - attach to the global instance, and assume a global WeakMap constructor\n      ko = global.ko;\n      attachToKo(global.ko);\n      weakMapFactory = function() { return new global.WeakMap(); };\n    }\n  }\n\n  prepareExports();\n\n})(this);"}
}});
