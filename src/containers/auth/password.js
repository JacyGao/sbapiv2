import React from 'react'
import PropTypes from 'prop-types';

const PasswordContainer = ({onKeyDown, onChange, onSubmit, error, loading}) => (
  <div>
    <input 
      onChange={onChange}        
      onKeyDown={onKeyDown}
      className={"_input" + (error ? " incorrect-input" : "")} 
      type="password" 
      placeholder="Your password" 
    />
    <p className={"text-error" + (error ? " text-error-visible" : "")}>{error}</p>
    <button 
      className={loading ? "_button_disabled" : "_button"} 
      onClick={onSubmit} 
      disabled={loading} >{loading ? "..." : "next"}
    </button>
  </div>  
);

PasswordContainer.propTypes = {
  onKeyDown: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default PasswordContainer