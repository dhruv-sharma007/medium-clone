import { create } from 'zustand'
import type { FollowersResponseData } from '../vite-env';

interface ProfileStatStore {
    data: FollowersResponseData | null;
    hasMore: boolean;
    setHasMore: (condition: boolean) => void;
    page: number;
    setPage: (page: number) => void;
    limit: 50,
    setData: (newdata: FollowersResponseData) => void
}

export const useProfileStatStore = create<ProfileStatStore>((set) => ({
    data: null,
    limit: 50,
    setData: (newdata: FollowersResponseData) => set((state) => ({
        data: state.data ? {
            followersData: [...state.data.followersData, ...newdata.followersData],
            followingData: [...state.data.followingData, ...newdata.followersData]
        } :
            newdata
    })),
    hasMore: true,
    page: 1,
    setPage: (page: number) => set(() => ({ page })),
    setHasMore: (condition: boolean) => set(() => ({ hasMore: condition })),
}))
