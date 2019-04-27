import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { employee } from '../../../../services/employee'
import ListPage from '../../../ListPage/index.js'
import axios from 'axios'

export default class Staff extends Component {
  constructor(props){
    super(props)
    this.state = {
      staff: []
    }
    this.axiosRequestSource = axios.CancelToken.source()
  }

  updateColumnHeaders = (e) => {
    const width = window.innerWidth
    if (width < 500) {
      this.setState({
        columnHeaders: null
      })
    } else if (width < 700) {
      this.setState({
        columnHeaders: ['name', 'active', 'labor']
      })
    } else {
      this.setState({
        columnHeaders: ['name', 'active', 'labor']
      })
    }
  }

  componentWillReceiveProps(nextProps){
    this.setStaff(nextProps, 0)
  }

  async componentDidMount() {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
    await this.setStaff(this.props, 1);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  setStaff = (props, mounted) => {
    if (mounted) {
      this.setState(
      {
        page: 1
      },
        async () => {
        await this.resetStaff()
        await this.fetchStaff()
      })
    }
  }

  fetchStaff = async() => {
    const { page } = this.state
    let workers = await employee.getAll(page, this.axiosRequestSource.token)
    if (workers) {
      await this.updateStaff(workers);
      await this.incrementPage()
    }
  }

  resetStaff = async() => {
    this.setState({ staff: [] })
  }

  incrementPage = () => {
    this.setState(prevState => ({
      page: prevState.page + 1
    }))
  }

  updateStaff = async(workers) => {
    if (workers) {
      const staff = [...this.state.staff]
      workers.forEach(w => staff.push(w))
      if (workers.length < 25) {

        this.setState({
          staff,
          hasMore: false
        })

      } else {

        this.setState({
          staff,
          hasMore: true
        })

      }
    } else {
      this.setState({
        staff: [],
      })
    }
  }


  List = ({ match, history }) => {
    const { staff, columnHeaders, hasMore } = this.state
    return (
      <ListPage
        title="Staff"
        type="Staff"
        columnHeaders={columnHeaders}
        data={staff}
        match={match}
        history={history}
        hasMore={hasMore}
        load={this.fetchStaff}
      />
    )
  }


  render(){
    const { match } = this.props
    return (
      <Switch>
        <Route exact path={match.path} render={(props) => this.List(props)}/>
      </Switch>
    )
  }
}
