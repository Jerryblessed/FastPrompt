import React, { useState } from 'react';
import { FaTwitter, FaStream, FaUpload, FaSun, FaRegMoon, FaSearch } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Search from '@/components/Search';
import { searchWithFuse } from '@/components/useFuse';

const categories = [
  { label: 'I am somthing...', emoji: '🌿', link: '/tags/what_am_i' },
  { label: 'Describe gesture', emoji: '📸', link: '/tags/gesture' },
  { label: 'Describe picture', emoji: '💻', link: '/tags/pic_describe' },
  { label: 'One-common-word', emoji: '🍎', link: '/tags/health' },
  { label: 'One-common-solution', emoji: '🔧', link: '/category/tech' },
  { label: 'ynnnn', emoji: '💡', link: '/category/tips' },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const result = searchWithFuse(query);

  const uploadvid = () => {
    // Open popup or trigger functionality in pages.tsx
    window.open('/page', '_blank');
  };

  const live = () => {
    // Open popup or trigger functionality in pages.tsx
    window.open('/live', '_blank');
  };

  const handleCategoryClick = (link: string) => {
    // Redirect to category link
    window.location.href = link;
  };

  return (
    <header className="not-prose px-2 sm:px-4 py-2.5 w-full">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link href="/" className="mx-auto block font-semibold dark:text-white">
          <h1 style={{ fontFamily: 'cursive', fontSize: '30px' }}>FastPrompt 💡</h1>
        </Link>

        <p>Pick a category below </p>


        <ul className="mx-auto flex flex-wrap p-4 md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          <li className="block py-2 pl-3 pr-4 text-gray-700 hover:text-blue-700 dark:hover:text-blue-700 rounded md:p-0 dark:text-white">
            <div className="relative">
              <input
                type="search"
                onChange={(event) => setQuery(event.target?.value)}
                value={query}
                id="header-search"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search here ..."
                required={true}
              />
              <FaSearch className="absolute top-3 right-3 text-gray-500 dark:text-gray-400" />
            </div>
          </li>

          <li>
            <button
              className="block py-2 pl-3 pr-4 rounded md:p-0"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FaSun /> : <FaRegMoon />}
            </button>
          </li>

          <li>
            <button
              className="block py-2 pl-3 pr-4 rounded md:p-0"
              onClick={uploadvid}
            >
              <FaUpload />
              <h1>Upload</h1>
            </button>
          </li>

        </ul>
      </div>

      <div className="container flex flex-wrap justify-center mx-auto mt-2">
        {categories.map(({ label, emoji, link }) => (
          <button
            key={label}
            onClick={() => handleCategoryClick(link)}
            className="px-4 py-2 m-2 text-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:opacity-80 transition duration-300"
          >
            {emoji} <span className="text-lg font-semibold">{label}</span>
          </button>
        ))}
      </div>

      {query && (
        <div className="container flex flex-wrap justify-center mx-auto mt-2">
          {result.map(({ item }) => (
            <div
              key={item?.id}
              className="text-white my-2 py-2 px-4 bg-blue-400 dark:bg-gray-900 dark:hover:bg-blue-400 border-none rounded-md dark:text-white"
            >
              <Link
                href={`/read/${item?.title.trim().toLowerCase().split(' ').join('-')}`}
                className="relative inline-flex items-center rounded-lg w-full text-sm font-medium"
              >
                {item?.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
