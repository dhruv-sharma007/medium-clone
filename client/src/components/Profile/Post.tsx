import { CiMenuKebab } from 'react-icons/ci';
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";


const Post = () => {
    return (
        <>
            <div className='max-w-140 rounded-xl p-2.5 bg-white shadow'>
                <div>
                    {/* upper section  */}
                    <section className='flex justify-between mt-2 mb-2'>
                        {/* This will contain profile pic of author, name, bio, content, image  */}
                        <div className='flex items-center gap-3' >
                            <span>
                                {/* profilePic  */}
                                <img className='rounded-full w-12 h-12 object-cover' height={50} width={50} src="https://avatars.githubusercontent.com/u/184009911?v=4" alt="" />
                            </span>
                            <div>
                                {/* name and content  */}
                                <p className='font-bold' >Yamdoot Sharma</p>
                                <p className='text-xs text-gray-500 max-w-[160px] truncate' >i am a dumb dev.</p>
                            </div>
                        </div>

                        <div className="dropdown dropdown-start ">
                            <div tabIndex={0} role="button" className="p-2 rounded m-1 cursor-pointer bg-[#f4f4f4]">
                                <CiMenuKebab />
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded z-1 w-52 p-2 shadow-sm ">
                                <li><a>Item 1</a></li>
                                <li><a>Item 2</a></li>
                            </ul>
                        </div>
                    </section>

                    {/* middle section  */}
                    <section className='mb-4'>
                        <p
                            className='text-sm text-gray-800 mb-2 truncate w-96'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis recusandae pariatu.
                        </p>
                        <div>
                            <img
                                src="https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?cs=srgb&dl=pexels-josh-hild-1270765-2422588.jpg&fm=jpg"
                                alt=""
                                className='rounded-lg w-full h-auto max-h-140 object-cover'
                            />
                        </div>
                    </section>

                    {/*  stat  */}
                    <section>
                        <div className='flex justify-between text-xs text-gray-600 mb-2 px-8'>
                            <p> <span className='font-bold'>8324</span> LIKES</p>
                            <p><span className='font-bold'>8324</span> COMMENTS</p>
                        </div>
                    </section>

                    {/* lower section  */}
                    <section className="flex justify-around pt-2 border-t border-gray-100">
                        <button>
                            <BiLike className="text-blue-500" size={24} />
                        </button>
                        <button>
                            <MdOutlineInsertComment className="text-gray-600" size={24} />
                        </button>
                    </section>
                </div>
            </div>
        </>
    )
}

export default Post
