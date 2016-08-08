import React from 'react';
import Field from '../Field';
import { FormInput } from 'elemental';

module.exports = Field.create({
	displayName: 'NumberField',
	statics: {
		type: 'Number',
	},
	valueChanged (event) {
		var newValue = event.target.value;
		if (/^-?\d*\.?\d*$/.test(newValue)) {
			this.props.onChange({
				path: this.props.path,
				value: newValue,
			});
		}
	},
	renderField () {
		var props = {
			name: this.props.path,
		};

		if (this.props.nested) props.name = this.props.nested + '.' + props.name + '_' + this.props._id;

		return (
			<FormInput
				name={this.getInputName(props.name)}
				ref="focusTarget"
				value={this.props.value}
				onChange={this.valueChanged}
				autoComplete="off"
			/>
		);
	},
});
