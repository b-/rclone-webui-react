import * as React from "react";
import PropTypes from "prop-types";

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (config, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength === 0) {
    return config;
  }

  return inputLength === 0
    ? []
    : config.filter(
        (lang) => lang.toLowerCase().slice(0, inputLength) === inputValue
      );
};

class RemoteListAutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      suggestions: [],
    };
  }

  componentDidMount = () => {
    this.setState({
      suggestions: getSuggestions(this.props.suggestions, ""),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, onChange } = this.props;

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
}

RemoteListAutoSuggest.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
};

export default RemoteListAutoSuggest;
