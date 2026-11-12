import { useEffect, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import api from './api'
import './App.css'

// =====================================
// NAVBAR
// =====================================

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Research<span className="text-info">Connect</span>
        </Link>

        <div className="navbar-nav ms-auto flex-row gap-3 align-items-center">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="btn btn-info text-dark fw-semibold px-4" to="/register">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

// =====================================
// HOME PAGE
// =====================================

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-7">
              <span className="badge bg-info text-dark mb-4 px-3 py-2">
                RESEARCH • DISCOVER • COLLABORATE
              </span>

              <h1 className="display-3 fw-bold mb-4">
                Connect Ideas.
                <br />
                <span className="text-info">Advance Research.</span>
              </h1>

              <p className="lead text-light-emphasis mb-4">
                Discover research publications, explore new ideas,
                find potential collaborators and make your research
                journey more productive.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-info btn-lg fw-semibold">
                  Get Started
                </Link>

                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Researcher Login
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center mt-5 mt-lg-0">
              <div className="hero-card">
                <div className="display-1 mb-3">🔬</div>
                <h3 className="fw-bold">ResearchConnect</h3>
                <p className="text-light-emphasis mb-0">
                  Your space for research discovery and collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Explore ResearchConnect</h2>
          <p className="text-secondary">
            Everything you need to support your research journey.
          </p>
        </div>

        <div className="row g-4">
          <FeatureCard
            icon="📚"
            title="Research Paper Discovery"
            description="Search and discover research publications across different academic fields."
          />

          <FeatureCard
            icon="🤝"
            title="Research Collaboration"
            description="Discover researchers whose interests align with your research interests."
          />

          <FeatureCard
            icon="📝"
            title="Paper Summarization"
            description="Generate concise summaries to understand research publications more easily."
          />
        </div>
      </section>
    </>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="col-md-4">
      <div className="feature-card h-100">
        <div className="fs-1 mb-3">{icon}</div>
        <h4 className="fw-bold">{title}</h4>
        <p className="text-secondary mb-0">{description}</p>
      </div>
    </div>
  )
}

// =====================================
// REGISTRATION
// =====================================

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    research_interests: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.post('/users', form)

      setSuccess('Registration successful! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (err) {
      setError(
        err.response?.data?.detail || 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-section">
      <div className="auth-card">
        <h2 className="fw-bold text-center mb-2">Join ResearchConnect</h2>

        <p className="text-secondary text-center mb-4">
          Create your researcher account.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Research Interests</label>
            <textarea
              name="research_interests"
              className="form-control"
              rows="3"
              placeholder="Example: Artificial Intelligence, Machine Learning"
              value={form.research_interests}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

// =====================================
// LOGIN
// =====================================

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await api.post('/login', form)
      navigate('/dashboard')

    } catch (err) {
      setError(
        err.response?.data?.detail || 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-section">
      <div className="auth-card">
        <h2 className="fw-bold text-center mb-2">Welcome Back</h2>

        <p className="text-secondary text-center mb-4">
          Login to your researcher account.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

// =====================================
// RESEARCH PAPER CARD
// =====================================

function PaperCard({ paper, onSummarize, summary, loading }) {
  return (
    <div className="research-card mb-4">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <span className="badge bg-info-subtle text-primary mb-2">
            Research Publication
          </span>

          <h5 className="fw-bold mb-2">{paper.title}</h5>
        </div>

        <span className="badge bg-light text-dark">
          {paper.publication_year || 'Year unavailable'}
        </span>
      </div>

      <p className="text-secondary small mb-2">
        <strong>Authors:</strong> {paper.authors || 'Not available'}
      </p>

      <p className="paper-abstract">
        {paper.abstract
          ? paper.abstract.length > 450
            ? `${paper.abstract.substring(0, 450)}...`
            : paper.abstract
          : 'Abstract not available for this publication.'}
      </p>

      <div className="d-flex flex-wrap gap-2 mt-3">
        {paper.paper_link && (
          <a
            href={paper.paper_link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            Read Paper ↗
          </a>
        )}

        <button
          className="btn btn-info btn-sm fw-semibold"
          onClick={onSummarize}
          disabled={loading || !paper.abstract}
          title={!paper.abstract ? 'Abstract unavailable' : 'Generate summary'}
        >
          {loading ? 'Generating...' : 'Summarize Paper'}
        </button>
      </div>

      {summary && (
        <div className="summary-box mt-3">
          <h6 className="fw-bold">📝 Paper Summary</h6>
          <p className="mb-0">{summary}</p>
        </div>
      )}
    </div>
  )
}

// =====================================
// COLLABORATOR CARD
// =====================================

function CollaboratorCard({ researcher }) {
  const percentage = Number(researcher.similarity_percentage || 0)

  return (
    <div className="collaborator-card">
      <div className="d-flex align-items-center gap-3">
        <div className="researcher-avatar">
          {researcher.name?.charAt(0)?.toUpperCase() || 'R'}
        </div>

        <div>
          <h6 className="fw-bold mb-1">{researcher.name}</h6>
          <small className="text-secondary">{researcher.email}</small>
        </div>
      </div>

      <p className="small text-secondary mt-3 mb-2">
        <strong>Research Interests:</strong>
        <br />
        {researcher.research_interests || 'Not specified'}
      </p>

      <div className="d-flex justify-content-between mb-1">
        <small className="fw-semibold">Research Similarity</small>
        <small className="fw-bold text-success">
          {percentage.toFixed(2)}%
        </small>
      </div>

      <div className="progress" style={{ height: '8px' }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  )
}

// =====================================
// DASHBOARD
// =====================================

function Dashboard() {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [papers, setPapers] = useState([])
  const [collaborators, setCollaborators] = useState([])

  const [profile, setProfile] = useState(null)
const [profileLoading, setProfileLoading] = useState(true)
const [profileError, setProfileError] = useState('')

  const [searchLoading, setSearchLoading] = useState(false)
  const [collaboratorLoading, setCollaboratorLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState({})

  const [summaries, setSummaries] = useState({})
  const [searchError, setSearchError] = useState('')
  const [collaboratorError, setCollaboratorError] = useState('')
  const [summaryErrors, setSummaryErrors] = useState({})
  const [message, setMessage] = useState('')

  // Load logged-in researcher profile
useEffect(() => {
  async function loadProfile() {
    try {
      const response = await api.get('/profile')
      setProfile(response.data)
    } catch (err) {
      setProfileError(
        err.response?.data?.detail ||
        'Unable to load researcher profile.'
      )
    } finally {
      setProfileLoading(false)
    }
  }

  loadProfile()
}, [])

  // Load collaborator recommendations
  useEffect(() => {
    async function loadCollaborators() {
      try {
        const response = await api.get('/recommendations/collaborators')

        setCollaborators(response.data.recommendations || [])

      } catch (err) {
        setCollaboratorError(
          err.response?.data?.detail ||
          'Unable to load collaborators. Please check your login session.'
        )
      } finally {
        setCollaboratorLoading(false)
      }
    }

    loadCollaborators()
  }, [])

  // Search research papers
  async function handleSearch(e) {
    e.preventDefault()

    if (!query.trim()) {
      setSearchError('Please enter a research topic.')
      return
    }

    setSearchLoading(true)
    setSearchError('')
    setMessage('')
    setPapers([])
    setSummaries({})
    setSummaryErrors({})

    try {
      const response = await api.get('/search/papers', {
        params: { query: query.trim() },
      })

      setPapers(response.data.papers || [])

      if (!response.data.papers?.length) {
        setMessage('No research papers found. Try another topic.')
      }

    } catch (err) {
      setSearchError(
        err.response?.data?.detail ||
        'Unable to search papers. Please try again.'
      )
    } finally {
      setSearchLoading(false)
    }
  }

  // Summarize a research paper
  async function handleSummarize(paper, index) {
    const key = paper.openalex_id || `${paper.title}-${index}`

    setSummaryLoading(prev => ({ ...prev, [key]: true }))
    setSummaryErrors(prev => ({ ...prev, [key]: '' }))

    try {
      const response = await api.post('/summarize-paper', {
        title: paper.title,
        abstract: paper.abstract,
      })

      const result = response.data.summary ||
        response.data.summarized_text ||
        response.data.result ||
        response.data

      setSummaries(prev => ({
        ...prev,
        [key]: typeof result === 'string'
          ? result
          : JSON.stringify(result),
      }))

    } catch (err) {
      setSummaryErrors(prev => ({
        ...prev,
        [key]: err.response?.data?.detail ||
          'Unable to summarize this paper. Please try again.',
      }))
    } finally {
      setSummaryLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  // Logout
  async function handleLogout() {
    try {
      await api.post('/logout')
      navigate('/login')
    } catch (err) {
      setSearchError('Unable to logout. Please try again.')
    }
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-topbar">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0">Research Workspace</h5>
            <small className="text-secondary">
              Discover knowledge. Build connections.
            </small>
          </div>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container py-5">

        {/* WELCOME */}
        <section className="dashboard-welcome mb-5">
          <div>
            <span className="badge bg-info text-dark mb-3">
              RESEARCHER WORKSPACE
            </span>

            <h2 className="fw-bold text-white">
              Welcome to ResearchConnect 👋
            </h2>

            <p className="text-light mb-0">
              Discover research publications and connect with researchers
              working in similar fields.
            </p>
          </div>
        </section>

        {/* MY PROFILE */}
<section className="dashboard-section mb-5">

  <div className="section-heading">
    <div>
      <h3 className="fw-bold">My Profile</h3>
      <p className="text-secondary">
        Your researcher information and academic interests.
      </p>
    </div>

    <span className="section-icon">👤</span>
  </div>

  {profileLoading && (
    <div className="text-center py-3">
      <div className="spinner-border text-info" />
      <p className="text-secondary mt-2">
        Loading your profile...
      </p>
    </div>
  )}

  {profileError && (
    <div className="alert alert-danger">
      {profileError}
    </div>
  )}

  {profile && (
    <div className="row g-4">

      <div className="col-md-3 text-center">
        <div
          className="researcher-avatar mx-auto"
          style={{
            width: '85px',
            height: '85px',
            fontSize: '35px'
          }}
        >
          {profile.name?.charAt(0).toUpperCase()}
        </div>

        <h5 className="fw-bold mt-3 mb-1">
          {profile.name}
        </h5>

        <span className="badge bg-info text-dark">
          Researcher
        </span>
      </div>

      <div className="col-md-9">

        <div className="mb-3">
          <label className="text-secondary small fw-semibold">
            RESEARCHER ID
          </label>
          <p className="fw-semibold mb-0">
            #{profile.id}
          </p>
        </div>

        <div className="mb-3">
          <label className="text-secondary small fw-semibold">
            EMAIL ADDRESS
          </label>
          <p className="fw-semibold mb-0">
            {profile.email}
          </p>
        </div>

        <div>
          <label className="text-secondary small fw-semibold">
            RESEARCH INTERESTS
          </label>

          <div className="mt-2">
            {profile.research_interests
              ?.split(',')
              .map((interest, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border me-2 mb-2 p-2"
                >
                  {interest.trim()}
                </span>
              ))}
          </div>
        </div>

      </div>
    </div>
  )}

</section>

        {/* STAT CARDS */}
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <div className="dashboard-stat">
              <div className="stat-icon">📚</div>
              <h3>{papers.length}</h3>
              <p>Research Papers Found</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-stat">
              <div className="stat-icon">🤝</div>
              <h3>{collaborators.length}</h3>
              <p>Suggested Collaborators</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-stat">
              <div className="stat-icon">📝</div>
              <h3>{Object.keys(summaries).length}</h3>
              <p>Papers Summarized</p>
            </div>
          </div>
        </div>

        {/* PAPER SEARCH */}
        <section className="dashboard-section mb-5">
          <div className="section-heading">
            <div>
              <h3 className="fw-bold">Discover Research Papers</h3>
              <p className="text-secondary">
                Search publications by topic, keyword or research area.
              </p>
            </div>
            <span className="section-icon">🔎</span>
          </div>

          <form onSubmit={handleSearch}>
            <div className="input-group search-input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Example: Artificial Intelligence, Cybersecurity, Machine Learning..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-info fw-semibold px-4"
                disabled={searchLoading}
              >
                {searchLoading ? 'Searching...' : 'Search Papers'}
              </button>
            </div>
          </form>

          {searchError && (
            <div className="alert alert-danger mt-3">{searchError}</div>
          )}

          {message && (
            <div className="alert alert-info mt-3">{message}</div>
          )}

          {searchLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
              <p className="text-secondary mt-2">Finding research papers...</p>
            </div>
          )}

          {!searchLoading && papers.length > 0 && (
            <div className="mt-4">
              <h5 className="fw-bold mb-3">
                Search Results ({papers.length})
              </h5>

              {papers.map((paper, index) => {
                const key = paper.openalex_id ||
                  `${paper.title}-${index}`

                return (
                  <div key={key}>
                    <PaperCard
                      paper={paper}
                      summary={summaries[key]}
                      loading={!!summaryLoading[key]}
                      onSummarize={() => handleSummarize(paper, index)}
                    />

                    {summaryErrors[key] && (
                      <div className="alert alert-danger">
                        {summaryErrors[key]}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* COLLABORATORS */}
        <section className="dashboard-section mb-5">
          <div className="section-heading">
            <div>
              <h3 className="fw-bold">Recommended Collaborators</h3>
              <p className="text-secondary">
                Connect with researchers who share similar interests.
              </p>
            </div>

            <span className="section-icon">🤝</span>
          </div>

          {collaboratorLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-info" />
              <p className="text-secondary mt-2">
                Finding potential collaborators...
              </p>
            </div>
          )}

          {collaboratorError && (
            <div className="alert alert-warning">
              {collaboratorError}
            </div>
          )}

          {!collaboratorLoading &&
            !collaboratorError &&
            collaborators.length === 0 && (
              <div className="alert alert-info">
                No collaborator recommendations are currently available.
              </div>
            )}

          <div className="row g-4">
            {collaborators.map(researcher => (
              <div className="col-md-6" key={researcher.researcher_id}>
                <CollaboratorCard researcher={researcher} />
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER MESSAGE */}
        <div className="text-center py-3">
          <p className="text-secondary mb-0">
            Keep exploring. Keep researching. Keep collaborating.
          </p>
        </div>

      </div>
    </div>
  )
}

// =====================================
// NOT FOUND
// =====================================

function NotFound() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-3 fw-bold">404</h1>
      <h3>Page Not Found</h3>

      <Link to="/" className="btn btn-info mt-3">
        Back to Home
      </Link>
    </div>
  )
}

// =====================================
// MAIN APPLICATION
// =====================================

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="bg-dark text-light text-center py-4 mt-auto">
        <p className="mb-1 fw-semibold">ResearchConnect</p>
        <small className="text-secondary">
          Connecting Researchers. Empowering Discovery.
        </small>
      </footer>
    </>
  )
}

export default App