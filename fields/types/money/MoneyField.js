import {FormInput} from 'elemental';
import Field from '../Field';
import React, {PropTypes} from 'react';

module.exports = Field.create({
	displayName: 'MoneyField',
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.number,
	},
	statics: {
		type: 'Money',
	},

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

		return (
			<FormInput
				autoComplete="off"
				name={this.getInputName(props.name)}
				onChange={this.valueChanged}
				ref="focusTarget"
				value={this.props.value}
			/>
		);
	},

});
