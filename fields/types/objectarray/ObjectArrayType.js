
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var addPresenceToQuery = require('../../utils/addPresenceToQuery');
var keystone = require('../../../');

/**
 * ObjectArray FieldType Constructor
 * @extends Field
 * @api public
 */
function objectarray(list, path, options) {
	objectarray.super_.call(this, list, path, options);
}
objectarray.properName = 'ObjectArray';
util.inherits(objectarray, FieldType);

objectarray.prototype.addToSchema = function () {
	var subListName = '_' + this.list.key.toLowerCase() + '.' + this.path;
	var sublist = this.subList = new keystone.List(subListName, {schema: '', hidden: true});

	sublist.add(this.options.nestedFields);
	sublist.register();

	this.list.schema.path(this.path, [sublist.schema]);
	this.bindUnderscoreMethods();
};

/* Export Field Type */
module.exports = objectarray;
