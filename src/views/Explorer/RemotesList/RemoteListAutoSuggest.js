import * as React from "react";
import PropTypes from "prop-types";

function RemoteListAutoSuggest({ value, onChange }) {
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(
    () =>
      setSuggestions({
        suggestions: this.props.suggestions,
      }),
    []
  );

  return (
    <>
      <label htmlFor="remote" className="sr-only">
        Remote
      </label>
      <input
        list="datalist-remote"
        id="remote"
        className="w-full"
        defaultValue={value}
        onChange={onChange}
      />

      <datalist id="datalist-remote">
        {this.state.suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion}>
            {suggestion}
          </option>
        ))}
      </datalist>
    </>
  );
}

RemoteListAutoSuggest.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
};

export default RemoteListAutoSuggest;
