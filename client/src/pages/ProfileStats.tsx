import { useParams } from 'react-router-dom';
import AuthorInfo from '../components/Profile/AuthorInfo';
import { useEffect, useState } from 'react';
import { useProfileStatStore } from '../store/ProfileState';
import { getFollowersAndFollowingApi } from '../lib/api';
import type { FollowersResponseData } from '../vite-env';

const ProfileStat = () => {
  const { id: userId } = useParams()
  // const { data, fetchData, hasMore } = useGetProfileState(id) 
  const { page, setHasMore, limit } = useProfileStatStore()

  const [data, setData] = useState<FollowersResponseData | null>(null)

  const fetchData = async () => {
    try {
      if (!userId) return;
      const res = await getFollowersAndFollowingApi(userId, String(page), String(limit));

      // setPage(page + 1); 

      setData(res.data.data);
      console.log("Fetch called", res.data);

      setHasMore(true);
      console.log(page)

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div>

        <div className="tabs tabs-lift">
          <input type="radio" name="my_tabs_3" className="tab" aria-label="Followers" />
          <div className="tab-content bg-base-100 border-base-300 p-6 min-h-[88vh] max-h-[88vh] overflow-scroll">
            <ul>
              {data?.followersData.map((u) => (
                <li key={u.id}>
                  <AuthorInfo
                    author={
                      {
                        bio: '',
                        name: String(u.name),
                        profilePic: String(u.profilePic),
                        username: u.username,
                      }} />
                </li>
              ))}
            </ul>
            {/* </InfiniteScroll> */}
          </div>

          <input type="radio" name="my_tabs_3" className="tab" aria-label="Followings" defaultChecked />
          <div className="tab-content bg-base-100 border-base-300 p-6 min-h-[88vh] max-h-[88vh] overflow-scroll">
            <ul>
              {data !== null ? data.followingData.map((u) => (
                <li key={u.id}>
                  <AuthorInfo
                    author={
                      {
                        bio: '',
                        name: String(u.name),
                        profilePic: String(u.profilePic),
                        username: u.username,
                      }} />
                </li>
              )) :
                <p>No following</p>
              }
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileStat
