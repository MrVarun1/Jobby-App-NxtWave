import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

export default function Home() {
  return (
    <div className="bg_container">
      <Header />
      <div className="home_content_bg">
        <div className="home_content">
          <h1 className="heading">Find The Job That Fits Your Life</h1>
          <p className="para">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="jobby_btn">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
