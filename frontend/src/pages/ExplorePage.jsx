import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import Repos from "../components/Repos";

const ExplorePage = () => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const exploreRepos = async (language) => {
    if (!language) {
      toast.error("Please select a language.");
      return;
    }

    setLoading(true);
    setRepos([]); // Reset the repository list before loading
    setSelectedLanguage("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/explore/repos/${encodeURIComponent(language)}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch repositories for ${language}`);
      }

      const { repos = [] } = await res.json(); // Default repos to an empty array
      setRepos(repos);
      setSelectedLanguage(language);
    } catch (error) {
      toast.error(error.message || "Failed to fetch repositories. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="bg-glass max-w-2xl mx-auto rounded-md p-4">
        <h1 className="text-xl font-bold text-center">Explore Popular Repositories</h1>
        <div className="flex flex-wrap gap-2 my-2 justify-center">
          {["javascript", "typescript", "c++", "python", "java"].map((lang) => (
            <img
              key={lang}
              src={`/${lang}.svg`}
              alt={`${lang} logo`}
              className="h-11 sm:h-20 cursor-pointer"
              onClick={() => exploreRepos(lang)}
            />
          ))}
        </div>
        {repos.length > 0 && (
          <h2 className="text-lg font-semibold text-center my-4">
            <span className="bg-blue-100 text-blue-800 font-medium me-2 px-2.5 py-0.5 rounded-full">
              {selectedLanguage.toUpperCase()}
            </span>
            Repositories
          </h2>
        )}
        {!loading && repos.length === 0 && selectedLanguage && (
          <p className="text-center text-gray-500">
            No repositories found for {selectedLanguage}.
          </p>
        )}
        {!loading && repos.length > 0 && <Repos repos={repos} />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default ExplorePage;
