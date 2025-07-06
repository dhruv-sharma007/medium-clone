import { Link, useLocation } from 'react-router-dom'
import { GoHome } from 'react-icons/go'
import { FaUserAlt } from 'react-icons/fa'
import { IoIosSearch } from 'react-icons/io'
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { useAuthStore } from '../store/auth'

const MobileDock = () => {
  const location = useLocation()
  const { user } = useAuthStore()

  const items = [
    { path: '/', icon: <GoHome />, label: 'Home' },
    { path: '/search', icon: <IoIosSearch />, label: 'Search' },
    { path: '/create-post', icon: <MdOutlineAddCircleOutline />, label: 'New' },
    { path: `/profile/${user?.username}`, icon: <FaUserAlt />, label: 'Profile' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-lg md:hidden">
      <ul className="flex justify-around p-2">
        {items.map(({ path, icon, label }) => {
          // For home, match exact '/', otherwise match prefix
          const active =
            path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path)
          return (
            <li key={path} className="flex-1 text-center">
              <Link to={path} className="flex flex-col items-center justify-center">
                <div className={`dock-icon text-2xl ${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
                <span className={`dock-label text-xs mt-1 ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MobileDock
