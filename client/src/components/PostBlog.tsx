import BarLoading from './Loading'

interface IPostBlog {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    setTitle: (value: string) => void;
    setContent: (value: string) => void;
    error: Error | null | undefined;
}

const PostBlog = ({ onSubmit, loading, setTitle, setContent, error }: IPostBlog) => {
    return (
        <>
            <div className="flex justify-center items-center min-h-screen px-4">
                <form
                    className="w-full max-w-xl space-y-4 bg-white p-6 rounded-2xl shadow-md"
                    onSubmit={onSubmit}
                >
                    <h2 className="text-2xl font-semibold text-center">Create Post</h2>
                    {loading && (
                        <div className="flex justify-center">
                            <BarLoading />
                        </div>
                    )}

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter your title"
                        className="input input-bordered w-full"
                        onChange={(e) => setTitle(e.target.value)}
                        minLength={3}
                    />

                    <textarea
                        name="content"
                        placeholder="Enter your content"
                        className="textarea textarea-bordered w-full min-h-[150px]"
                        onChange={(e) => setContent(e.target.value)}
                        minLength={10}
                    ></textarea>

                    <button type="submit" className="btn btn-primary w-full">
                        Submit
                    </button>
                </form>
                {error && (
                    <>
                        <div className="inline-grid *:[grid-area:1/1]">
                            <div className="status status-error animate-ping"></div>
                            <div className="status status-error"></div>
                        </div>
                        {error.message}
                    </>
                )}
            </div>
        </>
    )
}

export default PostBlog
