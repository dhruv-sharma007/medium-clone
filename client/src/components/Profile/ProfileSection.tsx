import Avatar from '../Avatar';
import ProfileStat from './ProfileStat';
import toast from 'react-hot-toast';
import { signoutApi } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { ProfilePicUrl } from '../../lib/static';
import type { IGetProfileResponse } from '@medium-clone/common';


const ProfileSection = ({ profile }: { profile: IGetProfileResponse | null }) => {

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
                            imgUrl={profile?.profilePic || ProfilePicUrl}
                            size={80}
                            font_Size={35}
                            name={profile?.name}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{profile?.name}</h1>
                            <h2 className="text-gray-500">{profile?.username}</h2>
                            <p className="text-gray-700 mt-2">
                                {profile?.bio}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end w-full md:w-auto gap-4">
                        <ProfileStat followers={profile?.followers} following={profile?.following} posts={profile?.postCount} />
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
