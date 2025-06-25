
import AppBar from "../components/AppBar";
import ProfileSection from '../components/Profile/ProfileSection';

const Profile = () => { 

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <AppBar />
      </header>

    <ProfileSection/>
      
    </>
  );
};

export default Profile;
