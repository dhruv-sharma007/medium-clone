import { useLocation } from "react-router-dom";
import Search from "./ui/Search";
import AuthorInfo from "./Profile/AuthorInfo";
import type { ITopUser } from "../vite-env";
import { useEffect, useState } from "react";
import { getTopUsers } from "../lib/api";
import toast from "react-hot-toast";
import { useSearchUser } from "../hooks";

const RightBar = () => {
  // const users: ITopUser[] = [
  //   {
  //     name: "Yamdoot",
  //     username: "yamu",
  //     _count: { followers: 9999 },
  //     bio: "I Love heem cream",
  //     id: "asdvsdfwjfo4jr232",
  //     profilePic: "https://i.pravatar.cc/150?img=12",
  //   },
  //   {
  //     name: "Sneha Rao",
  //     username: "sneha_rao",
  //     _count: { followers: 7800 },
  //     bio: "Coffee + Code = ❤️",
  //     id: "user001sneha",
  //     profilePic: "https://i.pravatar.cc/150?img=47",
  //   },
  //   {
  //     name: "Rohit Sheoran",
  //     username: "rohit.dev",
  //     _count: { followers: 8500 },
  //     bio: "Full-stack magician 🧙‍♂️",
  //     id: "user002rohit",
  //     profilePic: "https://i.pravatar.cc/150?img=11",
  //   },
  //   {
  //     name: "Ayesha Ali",
  //     username: "ayesha.codes",
  //     _count: { followers: 9100 },
  //     bio: "UI/UX whisperer 🎨",
  //     id: "user003ayesha",
  //     profilePic: "https://i.pravatar.cc/150?img=65",
  //   },
  //   {
  //     name: "Kunal Verma",
  //     username: "kunal_v",
  //     _count: { followers: 10200 },
  //     bio: "CTO @TechRiot | Dream big, code bigger",
  //     id: "user004kunal",
  //     profilePic: "https://i.pravatar.cc/150?img=3",
  //   },
  // ];
  // const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation();
  const [topUsers, setTopUsers] = useState<ITopUser[]>([]);
  const { users, setSearchTerm, searchTerm } = useSearchUser();

  useEffect(() => {
    if (topUsers?.length === 0) {
      getTopUsers()
        .then((res) => { 
          setTopUsers(res.data.data);
        })
        .catch((e) => toast.error(e.message));
    }
  }, [topUsers]);
  return (
    <div className="w-full min-h-full border-l-[0.1px] border-l-gray-700">
      <section className="flex justify-center p-4 min-h-20">
        {location.pathname === "/search" ? (
          ""
        ) : (
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
      </section>
      <p className="w-full text-center font-extrabold">Top authors of wRITER</p>
      {searchTerm.trim() === "" ? (
        <ul className="p-3">
          {topUsers.map((user) => (
            <li key={user.id}>
              <AuthorInfo author={user} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="p-3">
          {users?.map((user) => (
            <li key={Date.now()}>
              <AuthorInfo author={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RightBar;
