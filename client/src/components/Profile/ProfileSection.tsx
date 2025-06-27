import Avatar from '../Avatar';
import ProfileStat from './ProfileStat';
import toast from 'react-hot-toast';
import { signoutApi } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { ProfilePicUrl } from '../../lib/static';

const ProfileSection = () => {

    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            const res = await signoutApi();
            if (res.data.success) navigate('/signin');
        } catch (err) {
            const error = err as Error;
            toast.error(error.message);
        }
    };


    return (
        <>
            <main className="pt-20 w-full max-w-5xl mx-auto px-4">
                {/* Profile Header */}
                <section className="flex flex-col md:flex-row md:justify-between items-center gap-6 py-6 border-b">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Avatar
                            imgUrl={ProfilePicUrl}
                            size={80}
                            font_Size={35}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dhruv Sharma</h1>
                            <h2 className="text-gray-500">@dhruv99</h2>
                            <p className="text-gray-700 mt-2">
                                Design enthusiast. Photography lover. Traveler.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end w-full md:w-auto gap-4">
                        <ProfileStat followers={100} following={9} posts={28} />
                        <div className="flex gap-3">
                            <Link to={'/profile-edit'} className="btn btn-outline btn-sm rounded-lg">Edit Profile</Link>
                            <button className="btn btn-outline btn-error btn-sm rounded-lg" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </section>

                <br />

            </main>
        </>
    )
}

export default ProfileSection
