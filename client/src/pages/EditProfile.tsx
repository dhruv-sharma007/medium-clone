import { useRef, useState } from "react"
import { ProfilePicUrl } from "../lib/static"
import { api } from '../lib/api';
import type { IProfileUpdate } from "../vite-env";
import { Link } from "react-router-dom";

const EditProfile = () => {
    const user = {
        name: "Dhruv Sharma",
        username: "dhruv99",
        bio: "Hi, I am Dhruv Sharma, software engineer from Rawatsar.",
        profilePic: ProfilePicUrl
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [profile, setProfile] = useState<IProfileUpdate>(user)
    const [imagePreview, setImagePreview] = useState(ProfilePicUrl)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const file = fileInputRef.current?.files?.[0]
        if (file) {
            formData.set("profilePic", file)
        }

        try {
            const res = await api.post("/user/update-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            alert("Profile updated: " + res.data.message)
        } catch (err: any) {
            alert("Error: " + (err.response?.data?.message || "Failed to update profile"))
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file)
            setImagePreview(imageUrl)
        } else {
            alert("Please select a valid image file")
        }
    }

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click()
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" >
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profile</h2>

                <form onSubmit={onSubmit} className="space-y-6" encType="multipart/form-data">
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
                            name="profilePic"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            placeholder="change photo"
                            onChange={handleFileSelect}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={(e) => setProfile({ username: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            rows={3}
                            onChange={(e) => setProfile({ bio: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            to={'/profile'}
                            type="button"
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
