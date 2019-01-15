"use strict";
exports.__esModule = true;
;
;
;
// Should Rather use the builder pattern with a class here, that gets initialized as then return new object with methods on it for update.
function update(op, updateStatement, args, value) {
    var updatePath = Array.prototype.slice.call(arguments, 1);
    updatePath.pop();
    var updateStrPath = updatePath.join('.');
    var update = updateStatement[op] || {};
    update[updateStrPath] = value;
    updateStatement[op] = update;
    return updateStatement;
}
exports.update = update;
function $setValue(updateStatment, a, value) {
    return update('$set', updateStatment, arguments, value);
}
exports.$setValue = $setValue;
function $pushArrayField(updateStatment, a, value) {
    return update('$push', updateStatment, arguments, value);
}
exports.$pushArrayField = $pushArrayField;
function $pushArrayItemField(updateStatment, a, value) {
    return update('$push', updateStatment, arguments, value);
}
exports.$pushArrayItemField = $pushArrayItemField;
function InitOpStatment(object) {
    var op = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        op[_i - 1] = arguments[_i];
    }
    var obj = {};
    op.forEach(function (k) { return obj[k] = {}; });
    return obj;
}
exports.InitOpStatment = InitOpStatment;
function newStatmentBuilder() {
    //return new NewStatmentBuilder<T>();
}
exports.newStatmentBuilder = newStatmentBuilder;
// This needs to build the were clause and the updateoperator and array modifiers.
// some now need to figure out how to allow the were clause to be build and capture that information
// for use later on, to validate the $ operators type syntax's.
var NewStatmentBuilder = /** @class */ (function () {
    function NewStatmentBuilder(updateStatment) {
        this.updateStatment = updateStatment;
    }
    return NewStatmentBuilder;
}());
