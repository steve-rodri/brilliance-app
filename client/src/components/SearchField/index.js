import React, { Component, Fragment } from 'react'
import './index.css'

export default class SearchField extends Component {
  constructor(props){
    super(props)
    this.state = {
      highlightedResult: 0,
      hoveringResults: false,
      fieldActive: false,
    }
    this.searchResults = React.createRef();
  }

  componentDidUpdate(prevProps){
    const { searchResults, scroll, input: { value } } = this.props;
    const searchResultMatch = searchResults === prevProps.searchResults;

    if (!searchResultMatch) this.scrollToTop()

    if (prevProps.input.value !== value) {
      this.setState( prevState => ({
        highlightedResult: {
          ...prevState.highlightedResult,
          section: {
            ...prevState.highlightedResult.section,
            index: 0
          },
          index: 0
        }
      }))
    }

    if (scroll && scroll !== prevProps.scroll) {
      this.setState({ fieldActive: false })
    }
  }

  displayResults = () => {
    const { fieldActive  } = this.state
    if (fieldActive) {
      return { display: 'block'}
    } else {
      return { display: 'none' }
    }
  }

  handleViewResults = (value) => {
    if (value.length > 2) {
      this.setState({
        fieldActive: true
      })
    } else {
      this.setState({
        fieldActive: false
      })
    }
  }

  handleCloseResults = (e) => {
    this.setState({
      fieldActive: false
    })
  }

  leavingResults = (e) => {
    e.stopPropagation()
    this.setState({
      hoveringResults: false
    })
  }

  scrollResults = (direction) => {
    const { highlightedResult: { section, index, height } } = this.state
    const scrollPosition = this.searchResults.current.scrollTop

    switch (direction) {

      case 'up':
        if (scrollPosition === 0) break;
        if (section) {
          this.searchResults.current.scrollTop = (section.index + 1) * index * height
        } else {
          this.searchResults.current.scrollTop = index * height
        }
      break;

      case 'down':
        if (section) {
          this.searchResults.current.scrollTop = (section.index + 1) * index * height
        } else {
          this.searchResults.current.scrollTop = index * height
        }
      break;

      default:
      break;
    }
  }

  viewResults = () => {
    const {
      searchResults,
      subTitleClassName,
      resultClassName,
      formatResult,
      input: { name },
      onSelect
    } = this.props

    if (Array.isArray(searchResults)) {
      return searchResults && searchResults.map( (item, i) => (
        <div
          style={this.styleResult(i)}
          key={i}
          className={`${resultClassName} SearchField--result`}
          onClick={(e) => {
          e.stopPropagation();
          onSelect(e, name, i)
          this.handleCloseResults()
          }}
          onMouseEnter={(e) => this.changeHighlightedResult(e, i)}
        >
          <Fragment>{formatResult && formatResult(item)}</Fragment>
        </div>
      ))
    }
    if (searchResults) {
      const results = Object.entries(searchResults)
      return results.map((obj, index) => {
        const key = obj[0]
        const value = obj[1]
        const section = { name: key, index }
        return (
          <Fragment key={index}>
            <div className={`${subTitleClassName} SearchField--subtitle`} style={this.styleSectionTitle(section)}><h4>{key}</h4></div>
            {
              value && value.map( (val, i) =>
                <div
                  style={this.styleResult(i, section)}
                  key={i}
                  className={`${resultClassName} SearchField--result`}
                  onClick={(e) => {
                  e.stopPropagation();
                  onSelect(e, name, i, key)
                  this.handleCloseResults()
                  }}
                  onMouseEnter={(e) => this.changeHighlightedResult(e, i, section)}
                >
                  <Fragment>{formatResult && formatResult(val, key)}</Fragment>
                </div>
              )
            }
          </Fragment>
        )
      })
    }
  }

  changeHighlightedResult = (e, i, section) => {
    const { clientHeight: height } = e.target
    e.preventDefault()
    e.stopPropagation()
    const { highlightedResult } = this.state
    if (i !== highlightedResult.index) {
      this.setState( prevState => {
        const sectionMatch = prevState.highlightedResult.section === section
        if (!sectionMatch ) {
          return {
            highlightedResult: {
              section,
              index: i,
              height
            }
          }
        }
        return {
          highlightedResult: {
            ...prevState.highlightedResult,
            index: i,
            height
        }}
      })
    }
  }

  updateHighlightedResult = (direction) => {
    const { highlightedResult: { section, index } } = this.state;
    const { searchResults } = this.props
    const isArray = Array.isArray(searchResults)
    const isObj = () => searchResults === Object(searchResults) && !isArray;
    if (isObj()) {
      const sections = Object.entries(searchResults)
      switch (direction) {

        case 'up':
          if (index > 0) {
            this.setState( prevState => ({
              highlightedResult: {
                ...prevState.highlightedResult,
                index: prevState.highlightedResult.index -= 1,
              }
            }))

          } else if (section.index > 0){
            this.setState( prevState => {
              const prevSection = prevState.highlightedResult.section
              if (prevSection.index > 0) {
                const index = sections[prevSection.index - 1][1].length - 1
                return {
                  highlightedResult: {
                    ...prevState.highlightedResult,
                    section: {
                      ...prevSection,
                      index: prevSection.index -= 1,
                    },
                    index
                  }
                }
              } else return null
            })
          }
        break;

        case 'down':
          if (index < sections[section.index][1].length - 1) {
            this.setState( prevState => ({
              highlightedResult: {
                ...prevState.highlightedResult,
                index: prevState.highlightedResult.index += 1
              }
            }))

          } else if (section.index + 1 < sections.length) {
            this.setState( prevState => {
              const prevSection = prevState.highlightedResult.section
              return {
                highlightedResult: {
                  ...prevState.highlightedResult,
                  section: {
                    ...prevSection,
                    index: prevSection.index += 1
                  },
                  index: 0
                }
              }
            })
          }
        break;

        default:
        break;
      }
    } else if (isArray) {
      switch (direction) {
        case 'up':
          if (index > 0) {
            this.setState( prevState => ({
              highlightedResult: {
                ...prevState.highlightedResult,
                index: prevState.highlightedResult.index -= 1,
              }
            }))
          }
        break;
        case 'down':
          if (index < searchResults.length - 1) {
            this.setState( prevState => ({
              highlightedResult: {
                ...prevState.highlightedResult,
                index: prevState.highlightedResult.index += 1
              }
            }))
          }
        break;
        default:
        break;
      }
    }
  }

  choosingResult = (e) => {
    e.stopPropagation()
    this.setState({
      hoveringResults: true
    })
  }

  styleResult = (i, key) => {
    const { highlightedResult: { section , index } } = this.state
    const style = { }
    if (key) {
      if (key.index === section.index && i === index) style.backgroundColor = 'var(--light-blue)'
    } else {
      if (i === index) style.backgroundColor = 'var(--light-blue)'
    }
    return style
  }

  styleSectionTitle = (section) => {
    let style = {};
    if (section.index > 0) {
      style.top = `${section.index * 28}px`
      style.borderTop = "1px solid var(--light-gray)"
    }
    return style;
  }

  handleFocusSelect = (e) => {
    e.target.select()
  }

  scrollToTop = () => {
    this.searchResults.current.scrollTop = 0
  }

  render(){
    const { highlightedResult, hoveringResults } = this.state
    const {
      searchResults,

      formClassName,
      resultsClassName,
      styleForm,

      input:{
        className,
        placeholder,
        name,
        value,
        tabIndex
      },

      handleChange,
      formDataValue,
      onEnter,
    }
    = this.props

    return (
      <form
        autoComplete="off"
        className={formClassName}
        onFocus={this.handleFocusSelect}
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ( e.key === 'Enter' && searchResults ) {
            onEnter(e, name, highlightedResult.index, highlightedResult.section.name)
            this.handleCloseResults()
          }
        }}
        style={styleForm}
      >

        {/* Search */}
        <input
          name={name}
          placeholder={placeholder}
          className={className}
          value={value}
          tabIndex={tabIndex}
          onChange={(e) => {
            handleChange(e.target.name, e.target.value)
            this.handleViewResults(e.target.value)
          }}
          onFocus={this.handleViewResults}
          onBlur={(e) => {
            if (value && !formDataValue && !hoveringResults) {
              handleChange(name, '')
            }
            if (!hoveringResults) {
              this.handleCloseResults()
            }
          }}
          onKeyDown={(e) => {

            if (e.key === 'ArrowDown'){

              e.preventDefault()
              this.updateHighlightedResult('down')

              this.scrollResults('down')

            } else if (e.key === 'ArrowUp') {

              e.preventDefault()
              this.updateHighlightedResult('up')

              this.scrollResults('up')

            }

          }}
        />

        {/* Results */}
        <div
          className={`${resultsClassName} SearchField--results `}
          ref={this.searchResults}
          style={this.displayResults()}
          onMouseEnter={this.choosingResult}
          onMouseLeave={this.leavingResults}
        >
          {this.viewResults()}
        </div>

      </form>
    )
  }
}
