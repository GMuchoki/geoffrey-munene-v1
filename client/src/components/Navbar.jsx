import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HiHome,
  HiBookOpen,
  HiWrenchScrewdriver,
  HiPlay,
  HiBriefcase,
  HiCog6Tooth,
  HiUser,
  HiBars3,
  HiXMark,
  HiSun,
  HiMoon,
  HiArrowRight,
  HiArrowRightOnRectangle,
  HiArrowLeftOnRectangle,
  HiChevronDown,
  HiSquares2X2,
  HiUserGroup,
  HiFolder,
  HiChartBar,
  HiSparkles,
  HiCreditCard,
  HiQuestionMarkCircle
} from 'react-icons/hi2'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { useTokens } from '../contexts/TokenContext'
import '../styles/components/navbar.css'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useUser()
  const { tokens } = useTokens()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false)
  const [isCareerMenuOpen, setIsCareerMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const resourcesMenuRef = useRef(null)
  const careerMenuRef = useRef(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (resourcesMenuRef.current && !resourcesMenuRef.current.contains(event.target)) {
        setIsResourcesMenuOpen(false)
      }
      if (careerMenuRef.current && !careerMenuRef.current.contains(event.target)) {
        setIsCareerMenuOpen(false)
      }
    }

    if (isUserMenuOpen || isResourcesMenuOpen || isCareerMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen, isResourcesMenuOpen, isCareerMenuOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const handleLinkClick = () => {
    closeSidebar()
  }

  // Resources submenu items - use public /tools for all users (authenticated users will be redirected to /user/tools by the Tools component)
  const resourcesSubmenu = [
    { path: '/blog', label: 'Blog', icon: HiBookOpen },
    { path: '/tools', label: 'Tools', icon: HiWrenchScrewdriver },
  ]

  // Career submenu items
  const careerSubmenu = [
    { path: '/remote-jobs', label: 'Remote Jobs', icon: HiBriefcase },
    { path: '/community', label: 'Community', icon: HiUserGroup },
  ]

  // Different menu items for authenticated vs non-authenticated users
  const publicMenuItems = [
    { path: '/', label: 'Home', icon: HiHome },
    { path: '/services', label: 'Services', icon: HiCog6Tooth },
    { path: '/learn', label: 'Learn', icon: HiPlay },
  ]

  const authenticatedMenuItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: HiSquares2X2 },
    { path: '/user/learn', label: 'Learn', icon: HiPlay },
  ]

  const menuItems = isAuthenticated ? authenticatedMenuItems : publicMenuItems

  // Check if current path is in resources submenu
  const isResourcesActive = resourcesSubmenu.some(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))
  
  // Check if current path is in career submenu
  const isCareerActive = careerSubmenu.some(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to={isAuthenticated ? "/user/dashboard" : "/"} className="navbar-logo">
            <span className="logo-first">Geoffrey</span>
            <span className="logo-second">Munene</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="navbar-right">
            <ul className="navbar-menu">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path} className="navbar-item">
                    <Link 
                      to={item.path} 
                      className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      <Icon className="navbar-link-icon" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              
              {/* Career Dropdown */}
              <li className="navbar-item" ref={careerMenuRef}>
                <div className="navbar-dropdown-wrapper">
                  <button
                    className={`navbar-link navbar-dropdown-trigger ${isCareerActive ? 'active' : ''}`}
                    onClick={() => setIsCareerMenuOpen(!isCareerMenuOpen)}
                    onMouseEnter={() => setIsCareerMenuOpen(true)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <HiChartBar className="navbar-link-icon" />
                    Career
                    <HiChevronDown className={`navbar-dropdown-chevron ${isCareerMenuOpen ? 'open' : ''}`} />
                  </button>
                  
                  {isCareerMenuOpen && (
                    <div 
                      className="navbar-dropdown"
                      onMouseLeave={() => setIsCareerMenuOpen(false)}
                    >
                      {careerSubmenu.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`navbar-dropdown-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsCareerMenuOpen(false)}
                          >
                            <SubIcon className="navbar-dropdown-icon" />
                            <span>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </li>
              
              {/* Resources Dropdown */}
              <li className="navbar-item" ref={resourcesMenuRef}>
                <div className="navbar-dropdown-wrapper">
                  <button
                    className={`navbar-link navbar-dropdown-trigger ${isResourcesActive ? 'active' : ''}`}
                    onClick={() => setIsResourcesMenuOpen(!isResourcesMenuOpen)}
                    onMouseEnter={() => setIsResourcesMenuOpen(true)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    <HiFolder className="navbar-link-icon" />
                    Resources
                    <HiChevronDown className={`navbar-dropdown-chevron ${isResourcesMenuOpen ? 'open' : ''}`} />
                  </button>
                  
                  {isResourcesMenuOpen && (
                    <div 
                      className="navbar-dropdown"
                      onMouseLeave={() => setIsResourcesMenuOpen(false)}
                    >
                      {resourcesSubmenu.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`navbar-dropdown-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsResourcesMenuOpen(false)}
                          >
                            <SubIcon className="navbar-dropdown-icon" />
                            <span>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </li>
            </ul>

            {/* Desktop Auth Buttons */}
            {isAuthenticated ? (
              <div className="navbar-auth">
                {/* User Menu Dropdown */}
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  <button
                    className="user-menu-trigger"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="User menu"
                  >
                    <div className="user-avatar-small">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-menu-email">{user?.email?.split('@')[0] || 'User'}</span>
                    <HiChevronDown className={`user-menu-chevron ${isUserMenuOpen ? 'open' : ''}`} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="user-menu-dropdown">
                        <div className="user-menu-header">
                          <div className="user-avatar-menu">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="user-menu-info">
                            <div className="user-menu-name">{user?.email?.split('@')[0] || 'User'}</div>
                            <div className="user-menu-email-full">{user?.email}</div>
                          </div>
                        </div>
                        <div className="user-menu-tokens">
                          <HiSparkles className="token-icon" />
                          <span>{tokens} tokens available</span>
                        </div>
                        <div className="user-menu-divider"></div>
                        <Link
                          to="/user/profile"
                          className="user-menu-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HiUser className="user-menu-icon" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/user/settings"
                          className="user-menu-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HiCog6Tooth className="user-menu-icon" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          to="/user/billing"
                          className="user-menu-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HiCreditCard className="user-menu-icon" />
                          <span>Billing & Tokens</span>
                        </Link>
                        <div className="user-menu-divider"></div>
                        <Link
                          to="/contact"
                          className="user-menu-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HiQuestionMarkCircle className="user-menu-icon" />
                          <span>Help & Support</span>
                        </Link>
                        <div className="user-menu-divider"></div>
                        <button
                          className="user-menu-item logout"
                          onClick={() => {
                            logout()
                            setIsUserMenuOpen(false)
                            navigate('/')
                          }}
                        >
                          <HiArrowRightOnRectangle className="user-menu-icon" />
                          <span>Logout</span>
                        </button>
                      </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="navbar-login-btn">
                  <HiArrowLeftOnRectangle />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="navbar-signup-btn">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Desktop Theme Toggle */}
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <HiMoon /> : <HiSun />}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="navbar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <HiBars3 />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to={isAuthenticated ? "/user/dashboard" : "/"} className="sidebar-logo" onClick={handleLinkClick}>
            <span className="logo-first">Geoffrey</span>
            <span className="logo-second">Munene</span>
          </Link>
          <div className="sidebar-utils">
            <button 
              className="sidebar-util-btn" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <HiMoon /> : <HiSun />}
            </button>
            <button 
              className="sidebar-util-btn" 
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <HiXMark />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path} className="sidebar-item">
                  <Link 
                    to={item.path} 
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <Icon className="sidebar-icon" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
            
            {/* Career Section in Mobile */}
            <li className="sidebar-item sidebar-section-header">
              <HiChartBar className="sidebar-icon" />
              <span>Career</span>
            </li>
            {careerSubmenu.map((subItem) => {
              const SubIcon = subItem.icon
              const isActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')
              return (
                <li key={subItem.path} className="sidebar-item sidebar-subitem">
                  <Link 
                    to={subItem.path} 
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <SubIcon className="sidebar-icon" />
                    <span>{subItem.label}</span>
                  </Link>
                </li>
              )
            })}
            
            {/* Resources Section in Mobile */}
            <li className="sidebar-item sidebar-section-header">
              <HiFolder className="sidebar-icon" />
              <span>Resources</span>
            </li>
            {resourcesSubmenu.map((subItem) => {
              const SubIcon = subItem.icon
              const isActive = location.pathname === subItem.path || location.pathname.startsWith(subItem.path + '/')
              return (
                <li key={subItem.path} className="sidebar-item sidebar-subitem">
                  <Link 
                    to={subItem.path} 
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <SubIcon className="sidebar-icon" />
                    <span>{subItem.label}</span>
                  </Link>
                </li>
              )
            })}
            
            {/* Account Section in Mobile - Only for authenticated users */}
            {isAuthenticated && (
              <>
                <li className="sidebar-item sidebar-section-header">
                  <HiUser className="sidebar-icon" />
                  <span>Account</span>
                </li>
                <li className="sidebar-item sidebar-subitem">
                  <Link 
                    to="/user/profile" 
                    className={`sidebar-link ${location.pathname === '/user/profile' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <HiUser className="sidebar-icon" />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li className="sidebar-item sidebar-subitem">
                  <Link 
                    to="/user/settings" 
                    className={`sidebar-link ${location.pathname === '/user/settings' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <HiCog6Tooth className="sidebar-icon" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li className="sidebar-item sidebar-subitem">
                  <Link 
                    to="/user/billing" 
                    className={`sidebar-link ${location.pathname === '/user/billing' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <HiCreditCard className="sidebar-icon" />
                    <span>Billing & Tokens</span>
                  </Link>
                </li>
                <li className="sidebar-item sidebar-subitem">
                  <Link 
                    to="/contact" 
                    className={`sidebar-link ${location.pathname === '/contact' ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <HiQuestionMarkCircle className="sidebar-icon" />
                    <span>Help & Support</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <>
              <div className="sidebar-user-info">
                <p className="sidebar-user-email">{user?.email}</p>
                <p className="sidebar-user-tokens">{tokens} tokens</p>
              </div>
              <button 
                className="sidebar-cta-secondary"
                onClick={() => {
                  logout()
                  handleLinkClick()
                  navigate('/')
                }}
              >
                <HiArrowRightOnRectangle className="inline mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="sidebar-cta-primary"
                onClick={handleLinkClick}
              >
                Login <HiArrowRight className="inline ml-2" />
              </Link>
              <Link 
                to="/signup"
                className="sidebar-cta-secondary"
                onClick={handleLinkClick}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default Navbar


