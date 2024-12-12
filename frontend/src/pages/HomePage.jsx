import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";

const HomePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortType, setSortType] = useState("recent");

  const getUserProfileAndRepos = useCallback(async (username = "bhagat-shivam") => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile/${username}`);
      if (!res.ok) {
        throw new Error(`User not found: ${username}`);
      }
      const { repos, userProfile } = await res.json();

      const sortedRepos = [...repos];
      sortedRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by recent first

      setRepos(sortedRepos);
      setUserProfile(userProfile);

      return { userProfile, repos: sortedRepos };
    } catch (error) {
      toast.error(error?.message || "Failed to fetch user profile and repositories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();

    setLoading(true);
    setRepos([]);
    setUserProfile(null);

    const { userProfile, repos } = await getUserProfileAndRepos(username || "bhagat-shivam");

    if (userProfile) setUserProfile(userProfile);
    if (repos) setRepos(repos);

    setLoading(false);
    setSortType("recent");
  };

  const onSort = (sortType) => {
    const sortedRepos = [...repos];
    if (sortType === "recent") {
      sortedRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by recent first
    } else if (sortType === "stars") {
      sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count); // Sort by stars
    } else if (sortType === "forks") {
      sortedRepos.sort((a, b) => b.forks_count - a.forks_count); // Sort by forks
    }
    setSortType(sortType);
    setRepos(sortedRepos);
  };

  return (
    <div className="m-4">
      <Search onSearch={onSearch} />
      {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start">
        {!loading && userProfile && <ProfileInfo userProfile={userProfile} />}
        {!loading && repos.length > 0 && <Repos repos={repos} />}
        {loading && <Spinner />}
        {!loading && !userProfile && (
          <p className="text-center text-gray-500">No user found. Try searching for a different username.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
