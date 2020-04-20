import React, { useState, useRef, useCallback, useEffect } from "react";
import { isObject, isArray } from "../../helpers";
import { plusIcon, pencilIcon } from "../../icons";
import "./index.css";

const SearchField = props => {
  const resultsContainer = useRef();
  const [inputValue, setInputValue] = useState();
  const [highlightedResult, setHighlightedResult] = useState({
    section: null,
    index: null
  });
  const [hoveringResults, setHoveringResults] = useState(false);
  const [fieldActive, setFieldActive] = useState(false);
  const [editButtonVisible, setEditButtonVisible] = useState(false);
  const showEditButton = useCallback(() => setEditButtonVisible(true), []);
  const hideEditButton = () => setEditButtonVisible(false);

  const handleFocus = e => e.target.select();

  const handleKeyDown = e => {
    const { onEnter, onCreate, inputProps, searchResults } = props;
    if (e.key === "Enter") {
      if (countResults()) {
        onEnter({
          selectedResult: searchResults[highlightedResult.index]
        });
        handleCloseResults();
      } else if (
        inputProps.value.length > 2 &&
        typeof onCreate === "function"
      ) {
        onCreate();
        handleCloseResults();
      }
    }
  };

  const handleEditButtonPress = e => {
    const { onEdit } = props;
    e.preventDefault();
    e.stopPropagation();
    if (typeof edit === "function") onEdit();
  };

  const handleOpenResults = value => {
    if (value.length > 2) setFieldActive(true);
    else setFieldActive(false);
  };

  const handleCloseResults = () => setFieldActive(false);

  const handleScrollResults = direction => {
    const { section, index, height } = highlightedResult;
    const scrollPosition = resultsContainer.current.scrollTop;
    if (direction === "up") {
      if (scrollPosition === 0) return;
      if (section) {
        resultsContainer.current.scrollTop =
          (section.index + 1) * index * height;
      } else {
        resultsContainer.current.scrollTop = index * height;
      }
    }
    if (direction === "down") {
      if (section) {
        resultsContainer.current.scrollTop =
          (section.index + 1) * index * height;
      } else {
        resultsContainer.current.scrollTop = index * height;
      }
    }
  };

  const handleChangeHighlightedResult = direction => {
    const { section, index } = highlightedResult;
    const { searchResults } = props;
    const isArray = Array.isArray(searchResults);
    const isObj = searchResults === Object(searchResults) && !isArray;

    if (isObj) {
      const sections = Object.entries(searchResults);
      if (direction === "up") {
        if (index > 0) {
          setHighlightedResult(prevState => ({
            ...prevState,
            index: (prevState.index -= 1)
          }));
        } else if (section.index > 0) {
          setHighlightedResult(prevState => {
            const prevSection = prevState.section;
            if (prevSection.index > 0) {
              const index = sections[prevSection.index - 1][1].length - 1;
              return {
                ...prevState,
                section: {
                  ...prevSection,
                  index: (prevSection.index -= 1)
                },
                index
              };
            } else return null;
          });
        }
      }
      if (direction === "down") {
        if (index < sections[section.index][1].length - 1) {
          setHighlightedResult(prevState => ({
            ...prevState,
            index: (prevState.index += 1)
          }));
        } else if (section.index + 1 < sections.length) {
          setHighlightedResult(prevState => {
            const prevSection = prevState.section;
            return {
              ...prevState,
              section: {
                ...prevSection,
                index: (prevSection.index += 1)
              },
              index: 0
            };
          });
        }
      }
    } else if (isArray) {
      if (direction === "up") {
        if (index > 0) {
          setHighlightedResult(prevState => ({
            ...prevState,
            index: (prevState.index -= 1)
          }));
        }
      }
      if (direction === "down") {
        if (index < searchResults.length - 1) {
          setHighlightedResult(prevState => ({
            ...prevState,
            index: (prevState.index += 1)
          }));
        }
      }
    }
  };

  const countResults = () => {
    const { searchResults } = props;
    if (!searchResults) return 0;
    if (isArray(searchResults)) return searchResults.length;

    let resultCount = 0;
    const results = Object.entries(searchResults);
    results.forEach(obj => {
      if (obj[1] && obj[1].length) resultCount += obj[1].length;
    });
    return resultCount;
  };

  //value Change
  useEffect(() => {
    setHighlightedResult(prevState => ({
      ...prevState,
      section: {
        ...prevState.section,
        index: 0
      },
      index: 0
    }));
    setInputValue(props.value);
  }, [props.value]);
  //searchResults Change
  useEffect(() => {
    if (resultsContainer.current) {
      resultsContainer.current.scrollTop = 0;
    }
  }, [props.searchResults]);
  //scroll Change
  useEffect(() => {
    setFieldActive(false);
  }, [props.scroll]);
  //formValue Change
  useEffect(() => {
    if (props.formDataValue) showEditButton();
    else hideEditButton();
  }, [props.formDataValue, showEditButton]);

  return (
    <div className="SearchField">
      <form
        autoComplete="off"
        className={props.formClassName}
        onSubmit={e => e.preventDefault()}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        <Input
          {...props}
          resultProps={{
            hoveringResults,
            openResults: handleOpenResults,
            closeResults: handleCloseResults,
            scrollResults: handleScrollResults,
            changeHighlightedResult: handleChangeHighlightedResult
          }}
          inputProps={{
            ...props.inputProps,
            value: inputValue
          }}
        />
        <ResultsContainer
          {...props}
          containerRef={resultsContainer}
          fieldActive={fieldActive}
          resultProps={{
            highlightedResult,
            setHoveringResults,
            closeResults: handleCloseResults,
            changeHighlightedResult: handleChangeHighlightedResult,
            formatResult: props.formatResult,
            count: countResults
          }}
        />
      </form>
      <EditButton show={editButtonVisible} onEdit={handleEditButtonPress} />
    </div>
  );
};

const Input = ({ inputProps, onChange, formDataValue, ...rest }) => {
  const {
    openResults,
    closeResults,
    scrollResults,
    changeHighlightedResult,
    hoveringResults
  } = rest.resultProps;
  const handleKeyDown = e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      changeHighlightedResult("down");

      scrollResults("down");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      changeHighlightedResult("up");

      scrollResults("up");
    }
  };
  const handleBlur = e => {
    if (inputProps.value && !formDataValue && !hoveringResults) onChange("");
    if (!hoveringResults) closeResults();
  };
  const handleChange = ({ target: { value } }) => {
    onChange(value);
    openResults(value);
  };
  return (
    <input
      {...inputProps}
      onFocus={openResults}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

const ResultsContainer = props => {
  const styleResultsContainer = () => {
    const { searchResults, resultProps } = props;
    let style = {};
    if (isArray(searchResults)) {
      if (!searchResults.length && props.mobile) {
        style.height = "60px";
      } else if (!searchResults.length) {
        style.height = "50px";
      }
    } else if (!resultProps.resultCount) {
      style.height = "70px";
    }
    return style;
  };
  const leavingResults = e => {
    e.stopPropagation();
    props.resultProps.setHoveringResults(false);
  };
  const choosingResult = e => {
    e.stopPropagation();
    props.resultProps.setHoveringResults(true);
  };
  const render = () => {
    if (!props.resultProps.count()) return <CreateNewFromResult {...props} />;
    if (isObject(props.searchResults)) return <SectionedResults {...props} />;
    else return <Results {...props} />;
  };
  if (!props.fieldActive) return null;
  return (
    <div
      className={`SearchField--results-container`}
      ref={props.containerRef}
      style={styleResultsContainer()}
      onMouseEnter={choosingResult}
      onMouseLeave={leavingResults}
    >
      {render()}
    </div>
  );
};

const SectionedResults = ({ searchResults, ...rest }) => {
  const sections = Object.entries(searchResults);
  return sections.map((entry, index) => {
    const section = { index, name: entry[0], results: entry[1] };
    return <ResultsSection section={section} {...rest} />;
  });
};

const ResultsSection = ({ section, sectionTitleClassName }) => {
  return (
    <>
      <SectionTitle className={sectionTitleClassName} section={section} />
      {section.results.map((result, i) => (
        <Result />
      ))}
    </>
  );
};

const SectionTitle = ({ className, section }) => {
  const styleSectionTitle = section => {
    let style = {};
    if (section.index > 0) {
      style.top = `${section.index * 28}px`;
      style.borderTop = "1px solid var(--light-gray)";
    }
    return style;
  };
  return (
    <div
      className={`${className} SearchField--subtitle`}
      style={styleSectionTitle(section)}
    >
      <h4>{section.name}</h4>
    </div>
  );
};

const Results = ({ searchResults, ...rest }) => {
  return searchResults.map((result, i) => (
    <Result key={result.id || i} result={result} index={i} {...rest} />
  ));
};

const Result = ({
  resultClassName: className,
  result,
  index,
  section,
  resultProps,
  inputProps,
  onSelect
}) => {
  const handleSelect = e => {
    e.stopPropagation();
    onSelect({ selectedResult: result });
    resultProps.closeResults();
  };
  const handleMouseEnter = e => resultProps.changeHighlightedResult(e, index);
  const styleResult = (index, section) => {
    const {
      hoveringResults,
      highlightedResult: { section: highSection, index: highIndex }
    } = resultProps;
    const style = {};
    if (!hoveringResults) {
      if (section) {
        if (section.index === highSection.index && index === highIndex)
          style.backgroundColor = "var(--light-blue)";
      } else {
        if (index === highIndex) style.backgroundColor = "var(--light-blue)";
      }
    }
    return style;
  };
  return (
    <div
      style={styleResult(index, section)}
      key={(result && result.id) || index}
      className={`${className} SearchField--result`}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
    >
      <>{resultProps.formatResult(result, section)}</>
    </div>
  );
};

const CreateNewFromResult = ({ onCreate, label, ...props }) => {
  if (typeof onCreate !== "function") return null;
  const {
    resultProps: { closeResults },
    inputProps: { value }
  } = props;
  const handleCreate = e => {
    e.stopPropagation();
    onCreate();
    closeResults();
  };

  return (
    <div className="SearchField--create" onClick={handleCreate}>
      {plusIcon("1x")}
      <p>
        {`CREATE ${value.length < 25 ? `"${value}"` : `${label ? label : ""}`}`}
      </p>
    </div>
  );
};

const EditButton = ({ show, onEdit }) => {
  if (!show) return null;
  else return <button onClick={onEdit}>{pencilIcon()}</button>;
};

export default SearchField;
