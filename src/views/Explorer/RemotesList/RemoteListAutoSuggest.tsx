import * as React from "react";

interface IRemoteListAutoSuggest {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  suggestions: string[];
}

function RemoteListAutoSuggest({
  value,
  onChange,
  suggestions,
}: IRemoteListAutoSuggest) {
  return (
    <>
      <label htmlFor="remote" className="sr-only">
        Remote URL:
      </label>
      <input
        list="datalist-remote"
        id="remote"
        className="w-full"
        defaultValue={value}
        onChange={onChange}
      />

      <datalist id="datalist-remote">
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion}>
            {suggestion}
          </option>
        ))}
      </datalist>
    </>
  );
}

export default RemoteListAutoSuggest;
