import { useRef, useState } from "react"
import { ProfilePicUrl } from "../lib/static"
import { editProfile } from '../lib/api'
import type { IProfileUpdate } from "../vite-env"
import { Link } from "react-router-dom"
import imageCompression from 'browser-image-compression'
import { useAuthStore } from "../store/auth"
import { useCheckUsername } from "../hooks"

const EditProfile = () => {
    const { updateUser, user } = useAuthStore()
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [profile, setProfile] = useState<IProfileUpdate | null>(user)
    const [imagePreview, setImagePreview] = useState(ProfilePicUrl)
    const { message, success: usernameSuccess, setUsername } = useCheckUsername()

    const fileToBase64 = async (file: File): Promise<string> => {
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 600,
            useWebWorker: true
        })
        return await imageCompression.getDataUrlFromFile(compressedFile)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            const base64 = await fileToBase64(file)
            setImagePreview(base64)
        } else {
            alert("Please select a valid image file")
        }
    }

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click()
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const file = fileInputRef.current?.files?.[0]
        const reader = file ? await fileToBase64(file) : null
        
        const nameRegex = /^[a-zA-Z\s]+$/
        if (!nameRegex.test(profile?.name || '')) {
            alert("Name can only contain alphabets and spaces")
            return
        }

        if ((profile?.bio || '').length > 200) {
            alert("Bio cannot be more than 200 characters")
            return
        }

        if (profile?.username !== user?.username && !usernameSuccess) {
            alert("Please enter a valid username")
            return
        }

        const payload = {
            ...profile,
            profilePic: reader || profile?.profilePic,
        }

        try {
            const res = await editProfile(payload)
            const data = res.data.data
            if (res.data.success) updateUser(data)
            alert("Profile updated: " + res.data.message)
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || "Failed to update profile"))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleChangePhotoClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                            Change Photo
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile?.name || ''}
                                onChange={(e) => setProfile(prev => ({ ...(prev || {}), name: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profile?.username || ''}
                                onChange={(e) => {
                                    setProfile(prev => ({ ...(prev || {}), username: e.target.value }))
                                    setUsername(e.target.value)
                                }}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {profile?.username !== user?.username && (
                                <p className="text-red-500 text-sm mt-1">{message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={profile?.bio || ''}
                            rows={3}
                            onChange={(e) => setProfile(prev => ({ ...(prev || {}), bio: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            to="/profile"
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={profile?.username !== user?.username && !usernameSuccess}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:text-gray-400"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfile
