import {Link} from 'react-router-dom'

import {IoLocationSharp} from 'react-icons/io5'
import {FaEnvelope} from 'react-icons/fa'

import './index.css'

export default function JobItem(props) {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job

  return (
    <li className="job_item">
      <Link to={`/job/${id}`} className="link">
        <div className="title_logo_container">
          <img
            alt="company logo"
            className="company_logo_img"
            src={companyLogoUrl}
          />
          <div className="title_container">
            <h1 className="heading">{title}</h1>
            <p className="para">{rating}</p>
          </div>
        </div>
        <div className="address_package">
          <div className="address">
            <IoLocationSharp className="icon_styles" />
            <p>{location}</p>
            <FaEnvelope className="icon_styles" />
            <p>{employmentType}</p>
          </div>
          <div className="package">
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="hr" />
        <h1 className="heading">Description</h1>
        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}
