import axios from 'axios';
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
// import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [user, setUser] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [repo, setRepo] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

  let name: string = 'padil';

  const handleSearch = async () => {
    if (user) {
      setRepo(['']);
      const result = await axios.get(
        `https://api.github.com/search/users?q=${user}`,
      );
      setData(result.data.items.slice(0, 5));
      setSearch(user);
    } else {
      setData(['']);
      setSearch('');
    }
  };

  const handleDetail = (val: string) => {
    if (val == detail) {
      setDetail('');
    } else {
      setDetail(val);
    }
  };

  useEffect(() => {
    data.map((val) =>
      axios
        .get(`https://api.github.com/users/${val.login}/repos`)
        .then((item) => setRepo((prevRepo) => [...prevRepo, ...item.data]))
        .catch((error) => console.log(error)),
    );
  }, [data]);
  console.log(data);

  return (
    <div className="bg-neutral-200 min-h-screen py-3">
      {''}
      <div className="w-96 mx-auto border px-5 py-4 bg-white  ">
        <input
          onChange={(e) => setUser(e.target.value)}
          className="bg-gray-50 border border-gray-300  text-sm px-2 py-3 text-neutral-500  focus:outline-none w-full"
          placeholder="Exampleuser"
          required
        ></input>
        <button
          className="w-full bg-sky-400 text-white my-5 p-3"
          onClick={handleSearch}
        >
          Search
        </button>
        {search && (
          <span className="text-neutral-400">Showing users for "{search}"</span>
        )}
        {data[0] != '' &&
          data?.map((val) => (
            <>
              <div
                className="bg-neutral-200 my-4 px-3 group py-3 hover:cursor-pointer flex justify-between"
                onClick={() => handleDetail(val.login)}
              >
                <h1>{val.login}</h1>
                <i
                  className={`bi bi-chevron-down  rotate-180 ${
                    detail == val.login ? 'rotate-180' : 'rotate-0'
                  }`}
                ></i>
              </div>
              {repo[1] != '' &&
                repo.map((valRepo) =>
                  val.login == valRepo?.owner?.login ? (
                    <div
                      className={`bg-neutral-300 px-3  my-3 ml-8 py-3 ${
                        detail == val.login ? 'block' : 'hidden'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold text-1xl">
                          {valRepo.name}
                        </span>
                        <span>
                          {valRepo.stargazers_count}
                          <i className="bi bi-star-fill"></i>
                        </span>
                      </div>
                      <div className="mt-4">
                        {valRepo.description ? valRepo.description : '-'}
                      </div>
                    </div>
                  ) : (
                    ''
                  ),
                )}
            </>
          ))}
      </div>
    </div>
  );
}

export default App;
