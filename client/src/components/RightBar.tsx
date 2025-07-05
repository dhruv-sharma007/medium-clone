import Search from './ui/Search';

const RightBar = () => {
    return (
        <div className='w-full min-h-full border-l-[0.1px] border-l-gray-700'>
            <section className='flex justify-center p-4 min-h-20'>
                <Search />
            </section>


        </div>
    )
}

export default RightBar
