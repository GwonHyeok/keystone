import Field from '../Field';
import React from 'react';
import { FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'MoneyField',

	valueChanged (event) {
		var newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},

	renderField () {
		var props = {
			name: this.props.path,
		};

		if (this.props.nested) props.name = this.props.nested + '.' + props.name + '_' + this.props._id;

		return <FormInput name={props.name} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" />;
	},

});
