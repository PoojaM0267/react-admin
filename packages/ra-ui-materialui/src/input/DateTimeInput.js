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
    if (!(v instanceof Date) || isNaN(v)) return '';
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

/**
 * Converts a date from the Redux store, with timezone, to a date string
 * without timezone for use in an <input type="datetime-local" />.
 *
 * @param {Mixed} value date string or object
 * @param {String} Date string, formatted as yyyy-MM-ddThh:mm
 */
const format = value => {
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
 * Converts a datetime string without timezone to a date object
 * with timezone, using the browser timezone.
 *
 * @param {String} value Date string, formatted as yyyy-MM-ddThh:mm
 * @return {Date}
 */
const parse = value => new Date(value);

/**
 * Input component for entering a date and a time with timezone, using the browser locale
 *
 * Changes are dispatched to the form on blur.
 */
export const DateTimeInput = ({
    className,
    meta: { touched, error },
    input,
    isRequired,
    label,
    options,
    source,
    resource,
    ...rest
}) => (
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
        value={input.value}
    />
);

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

export default addField(DateTimeInput, { format, parse });
