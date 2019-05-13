import React, { Component, Fragment } from 'react'
import './index.css'

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

  componentDidUpdate(prevProps){
    const { searchResults, scroll, input: { value } } = this.props;
    if (searchResults && searchResults.length) {
      if (searchResults !== prevProps.searchResults) {
        this.scrollToTop()
      }
    }
    if (prevProps.input.value !== value) {
      this.setState({ highlightedResult: 0 })
    }
    if (scroll && scroll !== prevProps.scroll) {
      this.setState({ fieldActive: false })
    }
  }

  changeHighlightedResult = (e, i) => {
    e.preventDefault()
    e.stopPropagation()
    const { highlightedResult } = this.state
    if (i !== highlightedResult) {
      this.setState({ highlightedResult: i })
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

  handleFocusSelect = (e) => {
    e.target.select()
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
    const scrollPosition = this.searchResults.current.scrollTop
    const nextUpPosition = Math.floor( scrollPosition / 50 ) * 50
    const nextDownPosition = Math.ceil( scrollPosition / 50 ) * 50

    switch (direction) {
      case 'up':
      if (scrollPosition === 0) break;
      if (scrollPosition !== nextUpPosition) {
        this.searchResults.current.scrollTop = nextUpPosition
      } else {
        this.searchResults.current.scrollTop -= 150
      }
      break;
      case 'down':
      if (scrollPosition === 0) {
        this.searchResults.current.scrollTop += 150
        break;
      }
      if (scrollPosition !== nextDownPosition) {
        this.searchResults.current.scrollTop = nextDownPosition
      } else {
        this.searchResults.current.scrollTop += 150
      }
      break;
      default:
      break;
    }

  }

  scrollToTop = () => {
    this.searchResults.current.scrollTop = 0
  }

  updateHighlightedResult = (direction) => {
    const { highlightedResult } = this.state;
    const { searchResults: list } = this.props
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
    const { highlightedResult } = this.state
    const style = { }
    if (i === highlightedResult) {
      style.backgroundColor = 'var(--light-blue)'
    }

    return style
  }

  shouldScrollUp = () => {
    const { highlightedResult } = this.state
    const { searchResults } = this.props
    const scrollPosition = this.searchResults.current.scrollTop
    const offset = scrollPosition % 150
    const validOffset = (
      offset === 0  ||
      offset === 49 ||
      offset === 50 ||
      offset === 99 ||
      offset === 100
    )
    const rem0 = searchResults.length % 3 === 0
    const rem1 = searchResults.length % 3 === 1
    const rem2 = searchResults.length % 3 === 2

    const isFirstItem = highlightedResult % 3 === 0
    const isSecondItem = highlightedResult % 3 === 1
    const isThirdItem = highlightedResult % 3 === 2

    if (highlightedResult === 0) return false

    if (rem0) {
      if (isThirdItem) return true
    }
    if (rem1) {
      if (isFirstItem && offset === 0) return true
      if (isSecondItem && (offset === 50 || offset === 49)) return true
    }
    if (rem2) {
      if (isFirstItem && offset === 0) return true
      if (isThirdItem && (offset === 100 || offset === 99)) return true
    }

    if (!validOffset) this.scrollToTop()
  }

  shouldScrollDown = () => {
    const { highlightedResult } = this.state
    const { searchResults } = this.props
    const scrollPosition = this.searchResults.current.scrollTop
    const offset = scrollPosition % 150

    const rem0 = searchResults.length % 3 === 0
    const rem1 = searchResults.length % 3 === 1
    const rem2 = searchResults.length % 3 === 2

    const isFirstItem = highlightedResult % 3 === 0
    const isSecondItem = highlightedResult % 3 === 1
    const isThirdItem = highlightedResult % 3 === 2

    if (highlightedResult === 0) return false
    if (rem0) {
      if (isThirdItem) return true
    }
    if (rem1) {
      if (isThirdItem && offset === 0) return true
      if (isFirstItem && (offset === 50 || offset === 49)) return true
    }
    if (rem2) {
      if (isThirdItem && offset === 0) return true
      if (isSecondItem && (offset === 100 || offset === 99)) return true
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
          if ( e.key === 'Enter' && searchResults ) {
            onEnter(e, name, highlightedResult)
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

              if (this.shouldScrollDown()) {
                this.scrollResults('down')
              }

            } else if (e.key === 'ArrowUp') {

              e.preventDefault()
              this.updateHighlightedResult('up')

              if (this.shouldScrollUp()) {
                this.scrollResults('up')
              }

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
          {
            searchResults && searchResults.map( (item, i) => (
              <div
                style={this.styleResult(i)}
                key={item.id}
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
        </div>

      </form>
    )
  }
}
