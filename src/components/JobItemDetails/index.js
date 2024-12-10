import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {IoLocationSharp} from 'react-icons/io5'
import {FaEnvelope} from 'react-icons/fa'
import {HiOutlineExternalLink} from 'react-icons/hi'

import Header from '../Header'
import './index.css'

const apiCallsConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class JobItemDetails extends Component {
  state = {
    bodyRenderStatus: apiCallsConstants.initial,
    jobDetailsResponse: null,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({bodyRenderStatus: apiCallsConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const opts = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }

    try {
      const response = await fetch(url, opts)

      if (response.ok) {
        const jsonResponse = await response.json()

        const updatedJobDetails = this.updateJobDetails(
          jsonResponse.job_details,
        )
        const updatedSimilarJobs = jsonResponse.similar_jobs.map(job =>
          this.updateSimilarJobs(job),
        )

        this.setState({
          bodyRenderStatus: apiCallsConstants.success,
          jobDetailsResponse: updatedJobDetails,
          similarJobs: updatedSimilarJobs,
        })
      } else {
        this.setState({bodyRenderStatus: apiCallsConstants.failure})
      }
    } catch (error) {
      console.log(error)
      this.setState({bodyRenderStatus: apiCallsConstants.failure})
    }
  }

  updateJobDetails = data => ({
    title: data.title,
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills.map(skill => ({
      imageUrl: skill.image_url,
      name: skill.name,
    })),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
  })

  updateSimilarJobs = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  renderDetailsBody = () => {
    const {bodyRenderStatus} = this.state

    switch (bodyRenderStatus) {
      case apiCallsConstants.loading:
        return this.renderDetailsLoadingView()
      case apiCallsConstants.success:
        return this.renderDetailsSuccessView()
      case apiCallsConstants.failure:
        return this.renderDetailsFailureView()
      default:
        console.warn('Unhandled bodyRenderStatus:', bodyRenderStatus)
        return null
    }
  }

  renderDetailsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderDetailsFailureView = () => (
    <div className="jobs_failure_container">
      <img
        className="jobs_failure_img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="jobby_btn" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderDetailsSuccessView = () => {
    const {similarJobs} = this.state

    return (
      <div className="details_success_bg">
        {this.renderJobDetails()}
        <h1 className="align-flex-start">Similar Jobs</h1>
        <ul className="similar_jobs_container">
          {similarJobs.map(similarJob => this.renderSimilarJob(similarJob))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {jobDetailsResponse} = this.state
    const {
      title,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
    } = jobDetailsResponse

    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job_item">
        <div className="title_logo_container">
          <img
            alt="company logo"
            className="company_logo_img"
            src={companyLogoUrl}
          />
          <div className="title_container">
            <h1 className="heading  no_margin">{title}</h1>
            <p className="para no_margin">{rating}</p>
          </div>
        </div>
        <div className="address_package">
          <div className="address">
            <IoLocationSharp className="icon_styles font-size-1rem" />
            <p className="para_text">{location}</p>
            <FaEnvelope className="icon_styles font-size-1rem" />
            <p className="para_text">{employmentType}</p>
          </div>
          <div className="package">
            <p className="para_text">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="hr" />
        <div className="description_link">
          <h1 className="heading no_margin">Description</h1>
          <a href={companyWebsiteUrl} className="website_link">
            Visit
            <HiOutlineExternalLink className="icon_styles font-size-2rem" />
          </a>
        </div>
        <p>{jobDescription}</p>
        <div className="skills_container">
          <h1>Skills</h1>
          <ul className="skills_list">
            {skills.map(skill => this.renderSkills(skill))}
          </ul>
        </div>
        <div className="life_at_company_container">
          <h1 className="heading">Life at Company</h1>
          <div className="para_img_container">
            <p className="para width-45">{description}</p>
            <img
              alt={title}
              className="life_at_company_img width-45"
              src={imageUrl}
            />
          </div>
        </div>
      </div>
    )
  }

  renderSkills = skill => (
    <li key={skill.name} className="skill_item">
      <img alt={skill.name} className="skill_img" src={skill.imageUrl} />
      <p className="para">{skill.name}</p>
    </li>
  )

  renderSimilarJob = similarJob => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      rating,
      title,
    } = similarJob

    return (
      <li key={id} className="similar_job_item">
        <div className="title_logo_container">
          <img
            alt="similar job company logo"
            className="company_logo_img"
            src={companyLogoUrl}
          />
          <div className="title_container">
            <h1 className="heading  no_margin">{title}</h1>
            <p className="para no_margin">{rating}</p>
          </div>
        </div>
        <h1 className="heading no_margin">Description</h1>
        <p>{jobDescription}</p>
        <div className="similar_address">
          <IoLocationSharp className="icon_styles font-size-1rem" />
          <p className="para_text">{location}</p>
          <FaEnvelope className="icon_styles font-size-1rem" />
          <p className="para_text">{employmentType}</p>
        </div>
      </li>
    )
  }

  render() {
    return (
      <div className="bg_container">
        <Header />
        {this.renderDetailsBody()}
      </div>
    )
  }
}
