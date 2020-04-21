import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTraceableState } from "../../hooks";
import { isObject, isArray } from "../../helpers";
import { plusIcon, pencilIcon } from "../../icons";
import "./index.css";

const SearchField = (props) => {
  const resultsContainer = useRef();
  const [inputValue, setInputValue, prevInputValue] = useTraceableState("");
  const [results, setResults] = useState([]);
  const [highlightedResult, setHighlightedResult] = useState({
    section: null,
    index: null,
  });
  const [hoveringResults, setHoveringResults] = useState(false);
  const [fieldActive, setFieldActive] = useState(false);
  const [editButtonVisible, setEditButtonVisible] = useState(false);
  const showEditButton = useCallback(() => setEditButtonVisible(true), []);
  const hideEditButton = () => setEditButtonVisible(false);

  const handleFocus = (e) => e.target.select();

  const handleKeyDown = (e) => {
    const {
      onEnter,
      onCreate,
      resultProps: { formatResult },
    } = props;
    if (e.key === "Enter") {
      if (countResults() && typeof onEnter === "function") {
        onEnter({
          selectedResult: results[highlightedResult.index],
        });
        setInputValue(formatResult(results[highlightedResult.index]));
        handleCloseResults();
      } else if (inputValue.length > 2 && typeof onCreate === "function") {
        onCreate();
        handleCloseResults();
      }
    }
  };

  const handleEditButtonPress = (e) => {
    const { onEdit } = props;
    e.preventDefault();
    e.stopPropagation();
    if (typeof onEdit === "function") onEdit();
  };

  const handleOpenResults = (value) => {
    if (value.length > 2) setFieldActive(true);
    else setFieldActive(false);
  };

  const handleCloseResults = () => setFieldActive(false);

  const handleScrollResults = (direction) => {
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

  const handleChangeHighlightedResult = ({ direction, result }) => {
    const { section, index } = highlightedResult;
    const isArray = Array.isArray(results);
    const isObj = results === Object(results) && !isArray;
    if (result) setHighlightedResult({ ...result });
    if (direction) {
      if (isObj) {
        const sections = Object.entries(results);
        if (direction === "up") {
          if (index > 0) {
            setHighlightedResult((prevState) => ({
              ...prevState,
              index: (prevState.index -= 1),
            }));
          } else if (section.index > 0) {
            setHighlightedResult((prevState) => {
              const prevSection = prevState.section;
              if (prevSection.index > 0) {
                const index = sections[prevSection.index - 1][1].length - 1;
                return {
                  ...prevState,
                  section: {
                    ...prevSection,
                    index: (prevSection.index -= 1),
                  },
                  index,
                };
              } else return null;
            });
          }
        }
        if (direction === "down") {
          if (index < sections[section.index][1].length - 1) {
            setHighlightedResult((prevState) => ({
              ...prevState,
              index: (prevState.index += 1),
            }));
          } else if (section.index + 1 < sections.length) {
            setHighlightedResult((prevState) => {
              const prevSection = prevState.section;
              return {
                ...prevState,
                section: {
                  ...prevSection,
                  index: (prevSection.index += 1),
                },
                index: 0,
              };
            });
          }
        }
      }
      if (isArray) {
        if (direction === "up") {
          if (index > 0) {
            setHighlightedResult((prevState) => ({
              ...prevState,
              index: (prevState.index -= 1),
            }));
          }
        }
        if (direction === "down") {
          if (index < results.length - 1) {
            setHighlightedResult((prevState) => ({
              ...prevState,
              index: (prevState.index += 1),
            }));
          }
        }
      }
    }
  };

  const countResults = () => {
    if (!results) return 0;
    if (isArray(results)) return results.length;

    let resultCount = 0;
    const entries = Object.entries(results);
    entries.forEach((obj) => {
      if (obj[1] && obj[1].length) resultCount += obj[1].length;
    });
    return resultCount;
  };

  const getResults = useCallback(async () => {
    const { resultProps } = props;
    if (!resultProps.getResults && typeof resultProps.getResults !== "function")
      return;
    const data = await resultProps.getResults({ q: inputValue });
    if (data && data.length) setResults(data);
  }, [props, inputValue]);

  const fetchResults = useCallback(
    async (isSubscribed) => {
      if (!inputValue || !isSubscribed) return;
      const inputValueLength = inputValue.split("").length;
      if (inputValueLength > 2) {
        if (prevInputValue) {
          const prevInputValueLength = prevInputValue.split("").length;
          if (inputValueLength > prevInputValueLength) await getResults();
        } else {
          await getResults();
        }
      }
    },
    [inputValue, prevInputValue, getResults]
  );

  const eraseFormValue = useCallback(() => {
    if (props.deleteFormValue && typeof props.deleteFormValue === "function") {
      props.deleteFormValue();
    }
  }, [props]);

  //value Change
  useEffect(() => {
    let isSubscribed = true;
    fetchResults(isSubscribed);
    setHighlightedResult((prevState) => ({
      ...prevState,
      section: {
        ...prevState.section,
        index: 0,
      },
      index: 0,
    }));
    return () => (isSubscribed = false);
  }, [inputValue, fetchResults]);

  useEffect(() => {
    setInputValue(props.defaultValue || "");
  }, [props.defaultValue, setInputValue]);

  useEffect(() => {
    if (inputValue !== prevInputValue && inputValue !== props.defaultValue) {
      if (props.defaultValue) eraseFormValue();
    }
  }, [prevInputValue, inputValue, props.defaultValue, eraseFormValue]);

  //results Change
  useEffect(() => {
    if (resultsContainer.current) {
      resultsContainer.current.scrollTop = 0;
    }
  }, [results]);
  //scroll Change
  useEffect(() => {
    setFieldActive(false);
  }, [props.scroll]);
  //formValue Change
  useEffect(() => {
    if (props.formDataValue) showEditButton();
    else hideEditButton();
  }, [props.formDataValue, showEditButton]);
  //restore highlightedResult
  useEffect(() => {
    if (!hoveringResults) {
      setHighlightedResult({ index: 0, section: { index: 0 } });
    }
  }, [hoveringResults]);

  return (
    <div className="SearchField">
      <form
        autoComplete="off"
        className={props.className}
        onSubmit={(e) => e.preventDefault()}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        <Input
          {...props}
          resultProps={{
            ...props.resultProps,
            hoveringResults,
            openResults: handleOpenResults,
            closeResults: handleCloseResults,
            scrollResults: handleScrollResults,
            changeHighlightedResult: handleChangeHighlightedResult,
          }}
          inputProps={{
            ...props.inputProps,
            value: inputValue,
            setInputValue,
          }}
        />
        <ResultsContainer
          {...props}
          containerRef={resultsContainer}
          fieldActive={fieldActive}
          resultProps={{
            ...props.resultProps,
            results,
            highlightedResult,
            setHoveringResults,
            closeResults: handleCloseResults,
            changeHighlightedResult: handleChangeHighlightedResult,
            resultCount: countResults(),
          }}
          inputProps={{
            ...props.inputProps,
            value: inputValue,
            setInputValue,
          }}
        />
      </form>
      <EditButton show={editButtonVisible} onEdit={handleEditButtonPress} />
    </div>
  );
};

const Input = ({ inputProps, resultProps, formDataValue, ...rest }) => {
  const {
    openResults,
    closeResults,
    scrollResults,
    changeHighlightedResult,
    hoveringResults,
  } = resultProps;
  const { value: inputValue, setInputValue, ...restInputProps } = inputProps;
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      changeHighlightedResult({ direction: "down" });

      scrollResults("down");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      changeHighlightedResult({ direction: "up" });

      scrollResults("up");
    }
  };
  const handleBlur = (e) => {
    if (inputValue && !formDataValue && !hoveringResults) setInputValue("");
    if (!hoveringResults) closeResults();
  };
  const handleChange = ({ target: { value } }) => {
    setInputValue(value);
    openResults(value);
  };
  return (
    <input
      {...restInputProps}
      value={inputValue}
      onFocus={openResults}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};

const ResultsContainer = (props) => {
  const {
    resultProps: { setHoveringResults },
    fieldActive,
    containerRef,
  } = props;
  const styleResultsContainer = () => {
    const { results, resultCount } = props.resultProps;
    let style = {};
    if (isArray(results)) {
      if (!results.length && props.mobile) {
        style.height = "60px";
      } else if (!results.length) {
        style.height = "50px";
      }
    } else if (!resultCount) {
      style.height = "70px";
    }
    return style;
  };
  const leavingResults = (e) => {
    e.stopPropagation();
    setHoveringResults(false);
  };
  const choosingResult = (e) => {
    e.stopPropagation();
    setHoveringResults(true);
  };
  const render = () => {
    const { results, resultCount } = props.resultProps;
    if (!resultCount)
      return <CreateNewFromResult {...props} {...props.resultProps} />;
    if (isObject(results))
      return <SectionedResults {...props} {...props.resultProps} />;
    else return <Results {...props} {...props.resultProps} />;
  };
  if (!fieldActive) return null;
  return (
    <div
      className={`SearchField--results-container`}
      ref={containerRef}
      style={styleResultsContainer()}
      onMouseEnter={choosingResult}
      onMouseLeave={leavingResults}
    >
      {render()}
    </div>
  );
};

const SectionedResults = ({ results, ...rest }) => {
  const sections = Object.entries(results);
  return sections.map((entry, index) => {
    const section = { index, name: entry[0], results: entry[1] };
    return <ResultsSection section={section} {...rest} />;
  });
};

const ResultsSection = ({ section, sectionTitleClassName, ...rest }) => {
  return (
    <>
      <SectionTitle className={sectionTitleClassName} section={section} />
      {section.results.map((result, i) => (
        <Result key={result.id || i} result={result} index={i} {...rest} />
      ))}
    </>
  );
};

const SectionTitle = ({ className, section }) => {
  const styleSectionTitle = (section) => {
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

const Results = ({ results = [], ...rest }) => {
  return results.map((result, i) => (
    <Result key={result.id || i} result={result} index={i} {...rest} />
  ));
};

const Result = ({ result = {}, ...rest }) => {
  const {
    index,
    section,
    resultClassName: className,
    formatResult,
    changeHighlightedResult,
    closeResults,
    onSelect,
    inputProps: { setInputValue },
  } = rest;
  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect({ selectedResult: result });
    setInputValue(formatResult(result));
    closeResults();
  };
  const handleMouseEnter = () =>
    changeHighlightedResult({ result: { section, index } });
  const styleResult = (index, section) => {
    const {
      resultProps: {
        highlightedResult: { section: highSection, index: highIndex },
      },
    } = rest;
    const style = {};
    if (section) {
      if (section.index === highSection.index && index === highIndex)
        style.backgroundColor = "var(--light-blue)";
    } else {
      if (index === highIndex) style.backgroundColor = "var(--light-blue)";
    }
    return style;
  };
  return (
    <div
      style={styleResult(index, section)}
      key={result.id || index}
      className={`${className} SearchField--result`}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
    >
      <>{formatResult(result, section)}</>
    </div>
  );
};

const CreateNewFromResult = ({ onCreate, label, ...props }) => {
  if (typeof onCreate !== "function") return null;
  const {
    resultProps: { closeResults },
    inputProps: { value },
  } = props;
  const handleCreate = (e) => {
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
