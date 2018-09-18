import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { addField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

/**
 * Convert Date object to String
 *
 * @param {Date} v value to convert
 * @returns {String} A standardized datetime (yyyy-MM-ddThh:mm), to be passed to an <input type="datetime-local" />
 */
const dateFormatter = v => {
    if (!(v instanceof Date) || isNaN(v)) return;
    const pad = '00';
    const yyyy = v.getFullYear().toString();
    const MM = (v.getMonth() + 1).toString();
    const dd = v.getDate().toString();
    const hh = v.getHours().toString();
    const mm = v.getMinutes().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}T${(
        pad + hh
    ).slice(-2)}:${(pad + mm).slice(-2)}`;
};

// yyyy-MM-ddThh:mm
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const sanitizeValue = value => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }
    // valid dates should not be converted
    if (dateTimeRegex.test(value)) {
        return value;
    }

    const finalValue = typeof value instanceof Date ? value : new Date(value);
    return dateFormatter(finalValue);
};

/**
 * Input component for entering a date and a time with timezone, using the browser locale
 *
 * Changes are dispatched to the form on blur.
 */
export class DateTimeInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValue: props.input.value,
            stringValue: sanitizeValue(props.input.value),
        };
    }

    static getDerivedStateFromProps(props, state) {
        return props.input.value !== state.initialValue
            ? {
                  initialValue: props.input.value,
                  stringValue: sanitizeValue(props.input.value),
              }
            : {};
    }

    onChange = event => {
        this.setState({ stringValue: event.target.value });
    };

    onBlur = () => {
        const value = new Date(this.state.stringValue);
        this.props.input.onChange(value);
    };

    render() {
        const {
            className,
            meta,
            input,
            isRequired,
            label,
            options,
            source,
            resource,
            ...rest
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The DateTimeInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;

        return (
            <TextField
                {...input}
                className={className}
                type="datetime-local"
                margin="normal"
                error={!!(touched && error)}
                helperText={touched && error}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                InputLabelProps={{
                    shrink: true,
                }}
                {...options}
                {...sanitizeRestProps(rest)}
                value={this.state.stringValue}
                onChange={this.onChange}
                onBlur={this.onBlur}
            />
        );
    }
}

DateTimeInput.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateTimeInput.defaultProps = {
    options: {},
};

export default addField(DateTimeInput);
