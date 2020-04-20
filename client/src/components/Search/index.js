import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { hideNav, addRecentSearchTerm } from "../../redux";
import { searchIcon } from "../../icons";
import "./Search.css";

const Search = ({ className }) => {
  const [query, setQuery] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const mobile = useSelector(state => state.view.mobile);
  const dispatch = useDispatch();

  const handleFocus = e => setInputFocus(true);
  const handleBlur = () => setInputFocus(false);
  const handleChange = e => setQuery(e.target.value);
  const handleSubmit = e => {
    e.preventDefault();
    history.push(`${location.pathname}?q=${query}`);
    dispatch(addRecentSearchTerm(query));
    if (mobile) dispatch(hideNav());
  };

  const formStyles = () => {
    if (inputFocus)
      return {
        boxShadow: "0 0 2px 1px var(--turquoise)",
        borderColor: "var(--turquoise)"
      };
    return {};
  };

  return (
    <form
      className={`Search ${className}`}
      style={formStyles()}
      onSubmit={handleSubmit}
    >
      <div className="Search--icon">{searchIcon("1x")}</div>
      <input
        name="query"
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />
    </form>
  );
};

export default Search;
