import './index.css'

export default function NotFound() {
  return (
    <div className="not_found_bg_container">
      <img
        alt="not found"
        className="not_found_img"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      />
      <h1>Page Not Found</h1>
      <p>We are sorry, the page you requested could not be found</p>
    </div>
  )
}
