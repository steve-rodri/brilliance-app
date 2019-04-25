import React, { Component } from 'react'

export default class SearchField extends Component {
  constructor(props){
    super(props)
    this.state = {
      highlightedResult: 0,
      hoveringResults: false,
      fieldActive: false
    }
    this.searchResults = React.createRef();
  }

  componentWillReceiveProps(nextProps){
      const { highlightedResult } = this.state;
      const { searchResults } = nextProps;
      if (searchResults && searchResults.length) {
        if (highlightedResult > searchResults.length - 1) {
          this.setState({ highlightedResult: 0 })
        }
        this.setState({ searchResults })
      } else {
        this.setState({ searchResults: null })
      }
  }

  displayResults = () => {
    const { fieldActive  } = this.state
    if (fieldActive) {
      return { display: 'block', zIndex: '100' }
    } else {
      return { display: 'none' }
    }
  }

  handleFocusSelect = (e) => {
    e.target.select()
  }

  handleViewResults = () => {
    this.setState({
      fieldActive: true
    })
  }

  handleCloseResults = (e) => {
    this.setState({
      fieldActive: false
    })
  }

  choosingResult = (e) => {
    e.stopPropagation()
    this.setState({
      hoveringResults: true,
      highlightedResult: 0
    })
  }

  leavingResults = (e) => {
    e.stopPropagation()
    this.setState({
      hoveringResults: false
    })
  }

  scrollResults = (direction) => {
    switch (direction) {
      case 'up':
        this.searchResults.current.scrollTop -= 228
        break;
      case 'down':
        this.searchResults.current.scrollTop += 228
        break;
      default:
        break;
    }
  }

  updateHighlightedResult = (direction, list) => {
    const { highlightedResult } = this.state;
    switch (direction) {
      case 'up':
        if (highlightedResult > 0) {
          this.setState((prevState) => ({
            highlightedResult: prevState.highlightedResult -= 1
          }))
        }
      break;
      case 'down':
        if (highlightedResult + 1 < list.length) {
          this.setState((prevState) => ({
            highlightedResult: prevState.highlightedResult += 1
          }))
        }
      break;
      default:
      break;
    }
  }

  styleResult = (i) => {
    const { hoveringResults, highlightedResult } = this.state
    const style = { padding: '5px'}
    if (i === highlightedResult && !hoveringResults ) {
      style.backgroundColor = 'var(--light-blue)'
    }

    return style
  }

  render(){
    const { highlightedResult, hoveringResults, searchResults } = this.state
    const {
      formClassName,
      resultClassName,
      resultsClassName,
      formatResult,
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
      onSelect,
    }
    = this.props

    return (
      <form
        autoComplete="off"
        className={formClassName}
        onFocus={this.handleFocusSelect}
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ( (e.key === 'Tab' || e.key === 'Enter') && searchResults ) {
            onEnter(e, name, highlightedResult)
            this.handleCloseResults()
          }
        }}
      >
        <input
          name={name}
          placeholder={placeholder}
          className={className}
          value={value}
          tabIndex={tabIndex}
          onChange={(e) => {
            handleChange(e.target.name, e.target.value)
            this.handleViewResults()
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
              this.updateHighlightedResult('down', searchResults)

              if (highlightedResult !== 0 && (highlightedResult + 1) % 3 === 0) {
                this.scrollResults('down')
              }

            } else if (e.key === 'ArrowUp') {

              e.preventDefault()
              this.updateHighlightedResult('up', searchResults)

              if (this.state.highlightedResult !== 0 && (this.state.highlightedResult + 1) % 3 === 0) {
                this.scrollResults('up')
              }

            }

          }}
        />

        <div
          className={resultsClassName}
          ref={this.searchResults}
          style={this.displayResults()}
          onMouseEnter={this.choosingResult}
          onMouseLeave={this.leavingResults}
        >
          {searchResults && searchResults.map( (item, i) => (
            <div
              style={this.styleResult(i)}
              key={item.id}
              className={resultClassName}
              onClick={(e) => {
              e.stopPropagation();
              onSelect(e, name, i)
              this.handleCloseResults()
              }}
            >
              {formatResult && formatResult(item)}
            </div>
          ))}
        </div>
      </form>
    )
  }
}
