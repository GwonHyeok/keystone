module.exports = function (req, res, next) {
	if (req.method.toUpperCase() != 'POST') return next();
	var nativeKeystoneFields = [
		// Name field
		'.first',
		'.last',
		'.full'
	];

	var fields = {};
	var nestMapper = {};

	Object.keys(req.body).forEach((key) => {
		var props = key.split('.');
		if (props.length == 1) return;

		hasNativeField = nativeKeystoneFields.filter(function (field) {
			return key.indexOf(field) >= 0
		});
		if (hasNativeField.length > 0) return;

		var parentProp = props.splice(0, 1)[0];

		if (!fields[parentProp]) fields[parentProp] = {};

		var currentContext = fields[parentProp];

		for (var i = 0; i < props.length; i++) {
			var subProp = getSubProp(props[i]);

			if (!currentContext[subProp.id]) currentContext[subProp.id] = {};
			if (i != (props.length - 1)) {
				if (!currentContext[subProp.id][subProp.prop]) currentContext[subProp.id][subProp.prop] = {};
				nestMapper[subProp.prop] = 'nested';
			} else {
				currentContext[subProp.id][subProp.prop] = req.body[key];
				break;
			}

			currentContext = currentContext[subProp.id][subProp.prop];
		}
	});


	Object.keys(fields).forEach((field) => {

		if (!req.body[field]) req.body[field] = [];

		var values = fields[field];

		Object.keys(values).forEach((value) => {
			var actualField = values[value];
			if (value.match(/^[0-9a-fA-F]{24}$/)) {
				actualField._id = value;
			}

			Object.keys(actualField).forEach((fieldKey) => {
				if (nestMapper[fieldKey] && nestMapper[fieldKey] == 'nested') actualField[fieldKey] = fieldBuilder(actualField[fieldKey]);
			});

			req.body[field].push(actualField);
		});
	});

	Object.keys(fields).forEach((field) => {
		req.body[field].forEach((options) => {
			buildNestedDateType(options);
		});
	});

	function buildNestedDateType(options) {
		let date, time, offset;
		let keyName;

		Object.keys(options).forEach((option) => {
			if (Array.isArray(options[option]) || typeof options[option] === 'object') {
				buildNestedDateType(options[option]);
			} else {
				if (option.match(/_time$/g)) {
					time = options[option];
					delete options[option];
				} else if (option.match(/_date$/)) {
					keyName = option.split('_date')[0];
					date = options[option];
					delete options[option];
				} else if (option.match(/_tzOffset/)) {
					offset = options[option];
					delete options[option];
				}
			}
		});

		if (keyName && date && time && offset) {
			options[keyName] = `${date} ${time} ${offset}`
		}
	}

	function fieldBuilder(values) {
		var fields = [];

		Object.keys(values).forEach((value) => {
			var actualField = values[value];
			if (value.match(/^[0-9a-fA-F]{24}$/)) {
				actualField._id = value;
			}

			if (nestMapper[value] && nestMapper[value] == 'nested') actualField = fieldBuilder(values[value]);
			fields.push(actualField);
		});

		return fields;
	}

	function getSubProp(prop) {
		var props = prop.split('_');

		if (prop.match(/_time$/g)) {
			return {prop: props[0] + "_time", id: props[1]};
		} else if (prop.match(/_date$/)) {
			return {prop: props[0] + "_date", id: props[1]};
		} else if (prop.match(/_tzOffset/)) {
			return {prop: props[0] + "_tzOffset", id: props[1]};
		} else {
			return {prop: props[0], id: props[1]};
		}
	}

	return next();
}
