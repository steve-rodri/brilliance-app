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

  displayResults = () => {
    const { searchResults } = this.props
    const { fieldActive } = this.state
    if (searchResults) {
      if (fieldActive) {
        return { display: 'block' }
      } else {
        return { display: 'none' }
      }
    } else {
      return { display: 'none'}
    }
  }

  handleViewResults = (e) => {
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
      hoveringResults: true
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

  styleSelectedResult = (i) => {
    const { hoveringResults, highlightedResult } = this.state
    if (i === highlightedResult && !hoveringResults ) {
      return {
        backgroundColor: 'var(--light-blue)'
      }
    } else {
      return {}
    }
  }

  render(){
    const { highlightedResult, hoveringResults } = this.state
    const {
      searchResults,
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
      onSelect
    }
    = this.props

    return (
      <form
        autoComplete="off"
        className={formClassName}
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
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          onFocus={this.handleViewResults}
          onBlur={(e) => {
            if (!formDataValue && !hoveringResults) {
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
              style={this.styleSelectedResult(i)}
              key={item.id}
              className={resultClassName}
              onClick={(e) => {
              e.stopPropagation();
              onSelect(e, name, i)
              this.handleCloseResults()
              }}
            >
              {formatResult(item)}
            </div>
          ))}
        </div>
      </form>
    )
  }
}
