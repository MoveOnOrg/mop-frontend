import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

export const InputBlock = ({
  name,
  children,
  label,
  labelBefore,
  onChange,
  type,
  className,
  setRef,
  placeholder,
  value,
  ...rest
}) => (
  <div
    className={cx(
      type === 'checkbox' ? 'checkbox-input' : 'input-block',
      className,
      { 'label-before-input': labelBefore }
    )}
  >
    {labelBefore && <label htmlFor={name}>{label}</label>}
    {children || (
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onChange}
        ref={setRef}
        value={value}
        {...rest}
      />
    )}
    {!labelBefore && <label htmlFor={name}>{label}</label>}
  </div>
)

InputBlock.defaultProps = { type: 'text' }

InputBlock.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  labelBefore: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  setRef: PropTypes.func,
  value: PropTypes.string
}
