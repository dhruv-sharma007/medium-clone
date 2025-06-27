import { Outlet } from 'react-router-dom'
import AppBar from '../components/AppBar'

const MainLayout = () => {
    return (
        <>
            <div className=" fixed w-full z-50">
                <AppBar />
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default MainLayout
