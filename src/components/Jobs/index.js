import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiCallsConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class Jobs extends Component {
  state = {
    profileStatus: apiCallsConstants.initial,
    profileDetails: null,
    jobsStatus: apiCallsConstants.initial,
    jobsList: [],
    searchInput: '',
    employmentTypeFilter: [],
    salaryRangeFilter: '',
  }

  componentDidMount() {
    this.fetchProfileFun()
    this.fetchJobsFun()
  }

  fetchProfileFun = async () => {
    this.setState({profileStatus: apiCallsConstants.loading})

    const url = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('jwt_token')
    const opts = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }

    const response = await fetch(url, opts)
    const jsonResponse = await response.json()

    if (response.ok) {
      const profileDetails = jsonResponse.profile_details
      const updatedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileDetails,
        profileStatus: apiCallsConstants.success,
      })
    } else {
      this.setState({profileStatus: apiCallsConstants.failure})
    }
  }

  fetchJobsFun = async () => {
    this.setState({jobsStatus: apiCallsConstants.loading})

    const {searchInput, employmentTypeFilter, salaryRangeFilter} = this.state
    const employmentTypeString = employmentTypeFilter.join(',')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${salaryRangeFilter}&search=${searchInput}`
    const token = Cookies.get('jwt_token')
    const opts = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }

    const response = await fetch(url, opts)
    const jsonResponse = await response.json()

    if (response.ok) {
      const {jobs} = jsonResponse

      const updatedJobsList = jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobsStatus: apiCallsConstants.success,
        jobsList: updatedJobsList,
      })
    } else {
      this.setState({jobsStatus: apiCallsConstants.failure})
    }
  }

  renderProfile = () => {
    const {profileStatus, profileDetails} = this.state

    switch (profileStatus) {
      case apiCallsConstants.loading:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case apiCallsConstants.success:
        const {name, profileImageUrl, shortBio} = profileDetails
        return (
          <div className="profile_success_container">
            <img alt="profile" src={profileImageUrl} className="dp_img" />
            <h2 className="profile_heading">{name}</h2>
            <p className="profile_para">{shortBio}</p>
          </div>
        )
      case apiCallsConstants.failure:
        return (
          <div className="profile_failure_container">
            <button
              type="button"
              onClick={this.fetchProfileFun}
              className="jobby_btn"
            >
              Retry
            </button>
          </div>
        )
      default:
        return <p>Default Profile</p>
    }
  }

  renderEmploymentTypeFilter = () => (
    <div className="filter_container">
      <h2 className="heading">Type of Employment</h2>
      <ul className="filter_options_container">
        {employmentTypesList.map(this.renderEachEmployment)}
      </ul>
    </div>
  )

  renderEachEmployment = employment => {
    const {employmentTypeFilter} = this.state
    const {employmentTypeId, label} = employment
    const isChecked = employmentTypeFilter.includes(employmentTypeId)

    const onChangeEmployment = () => {
      this.setState(prevState => {
        const {employmentTypeFilter} = prevState

        const updatedEmploymentTypeFilter = employmentTypeFilter.includes(
          employmentTypeId,
        )
          ? employmentTypeFilter.filter(id => id !== employmentTypeId)
          : [...employmentTypeFilter, employmentTypeId]

        return {employmentTypeFilter: updatedEmploymentTypeFilter}
      }, this.fetchJobsFun)
    }

    return (
      <li key={employmentTypeId} className="option_item">
        <input
          type="checkbox"
          id={employmentTypeId}
          checked={isChecked}
          onChange={onChangeEmployment}
        />
        <label htmlFor={employmentTypeId}>{label}</label>
      </li>
    )
  }

  renderSalaryRangeFilter = () => (
    <div className="filter_container">
      <h2 className="heading">Salary Range</h2>
      <ul className="filter_options_container">
        {salaryRangesList.map(this.renderEachSalaryRanges)}
      </ul>
    </div>
  )

  renderEachSalaryRanges = salary => {
    const {salaryRangeFilter} = this.state
    const {salaryRangeId, label} = salary
    const isSelected = salaryRangeId === salaryRangeFilter

    return (
      <li key={salaryRangeId} className="option_item">
        <input
          type="radio"
          value={salaryRangeId}
          checked={isSelected}
          id={salaryRangeId}
          name="salaryRange"
          onChange={this.onSelecting}
        />
        <label htmlFor={salaryRangeId}>{label}</label>
      </li>
    )
  }

  onSelecting = event => {
    this.setState(
      prevState => ({
        salaryRangeFilter:
          prevState.salaryRangeFilter === event.target.value
            ? ''
            : event.target.value,
      }),
      this.fetchJobsFun,
    )
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="search_container">
        <input
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onSearchInputChange}
          className="search_input"
          data-testid="searchButton"
        />
        <button
          type="button"
          className="search_btn"
          onClick={this.onSearchIconClick}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onSearchIconClick = () => {
    const {searchInput} = this.state
    if (searchInput !== '') {
      this.fetchJobsFun()
    }
  }

  onSearchInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  renderJobs = () => {
    const {jobsStatus, jobsList} = this.state
    switch (jobsStatus) {
      case apiCallsConstants.loading:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )

      case apiCallsConstants.success:
        return jobsList.length > 0
          ? this.renderJobSuccessPage()
          : this.renderNoJobsPage()

      case apiCallsConstants.failure:
        return (
          <div className="jobs_failure_container">
            <img
              className="jobs_failure_img"
              alt="failure view"
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            />
            <h1 className="heading">Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button
              type="button"
              className="jobby_btn"
              onClick={this.fetchJobsFun}
            >
              Retry
            </button>
          </div>
        )
      default:
        return <p>Default Jobs</p>
    }
  }

  renderNoJobsPage = () => (
    <div className="no_jobs_found_container">
      <img
        alt="no jobs"
        className="no_jobs_found_img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1 className="heading">No Jobs Found</h1>
      <p className="para">We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderJobSuccessPage = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobs_list">
        {jobsList.map(job => (
          <JobItem key={job.id} job={job} />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="bg_container">
        <Header />
        <div className="jobs_content">
          <div className="profile_filters_container">
            <div className="profile_container">{this.renderProfile()}</div>
            <hr className="hr" />
            {this.renderEmploymentTypeFilter()}
            <hr className="hr" />
            {this.renderSalaryRangeFilter()}
          </div>
          <div className="jobs_search_content">
            {this.renderSearchBar()}
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}
