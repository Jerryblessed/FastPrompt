// pages/tags/[slug].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Card from '@/components/Card';
import { posts } from '@/data/posts';
import { Post } from '@/type';
import { Buffer } from 'buffer';
import Web3 from 'web3';
import { Transaction } from 'ethereumjs-tx';

interface Props {
  tagPosts: string;
}

interface Context {
  params: {
    slug: string;
  };
}

export async function getStaticProps(context: Context) {
  const { slug } = context.params;
  const tagPosts = posts.filter(item =>
    item.tags.some(tag => tag.toLowerCase().trim().split(' ').join('-') === slug)
  );

  return {
    props: {
      tagPosts: JSON.stringify(tagPosts),
    },
  };
}

export async function getStaticPaths() {
  const paths = posts.flatMap(item =>
    item.tags.map(tag => ({
      params: { slug: tag.toLowerCase().trim().split(' ').join('-') },
    }))
  );

  return {
    paths,
    fallback: false,
  };
}

function Tags({ tagPosts }: Props) {
  const router = useRouter();
  const tagName = router.query.slug as string;
  const tagPostsArray: Post[] = JSON.parse(tagPosts);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(600);
  const [input, setInput] = useState('');
  const [account2, setAccount2] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState<boolean | null>(null);
  const [guesses, setGuesses] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    if (difficulty === 'easy') {
      setTimer(600);
      setGuesses(15);
    } else if (difficulty === 'medium') {
      setTimer(300);
      setGuesses(10);
    } else if (difficulty === 'hard') {
      setTimer(150);
      setGuesses(5);
    }
  }, [difficulty]);

  useEffect(() => {
    if (currentIndex >= tagPostsArray.length) {
      alert('Congratulations! You have completed all levels.');
      setCurrentIndex(0);
      setScore(0);
      setProgress(0);
      setTimer(difficulty === 'easy' ? 600 : difficulty === 'medium' ? 300 : 150);
      setGuesses(difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 5);
    } else if (timer <= 0 || guesses <= 0) {
      alert('Game Over! Try again.');
      setCurrentIndex(0);
      setScore(0);
      setProgress(0);
      setTimer(difficulty === 'easy' ? 600 : difficulty === 'medium' ? 300 : 150);
      setGuesses(difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 5);
    }
  }, [currentIndex, timer, guesses, tagPostsArray.length, difficulty]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleGuess = () => {
    if (tagPostsArray[currentIndex].title.toLowerCase() === input.toLowerCase()) {
      setScore(prevScore => prevScore + 1);
      setProgress(((score + 1) / tagPostsArray.length) * 100);
      setCurrentIndex(prevIndex => prevIndex + 1);
      setInput('');
      setMotivationalMessage('Correct! Moving to the next...');
      setTimeout(() => setMotivationalMessage(''), 2000);

      if (useWallet) {
        const web3 = new Web3('https://eth-rpc-api.thetatoken.org/rpc');
        const chainID = 366;
        const account1 = '0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A';
        const privateKey1 = Buffer.from('1111111111111111111111111111111111111111111111111111111111111111', 'hex');

        web3.eth.getTransactionCount(account1, (err: Error | null, txCount: number) => {
          if (err) {
            console.error('Error getting transaction count:', err);
            return;
          }

          const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: account2,
            value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('4000', 'gwei')),
            chainId: chainID,
          };

          const tx = new Transaction(txObject);
          tx.sign(privateKey1);
          const serializedTx = tx.serialize();
          const raw = '0x' + serializedTx.toString('hex');

          web3.eth.sendSignedTransaction(raw, (err: Error | null, txHash: string) => {
            if (err) {
              console.error('Error sending transaction:', err);
              return;
            }
            console.log('txHash:', txHash);
          });
        });

        alert('25 Tfuel added');
      }
    } else {
      setInput('');
      setGuesses(prevGuesses => prevGuesses - 1);

      if (guesses > 1) {
        setMotivationalMessage(`Almost there! ${guesses - 1} more guesses`);
      } else {
        setMotivationalMessage('This is your last guess!');
      }
      setTimeout(() => setMotivationalMessage(''), 2000);

      if (guesses === 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }
    }
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHowToPlayOpen, setHowToPlayOpen] = useState(false);
  const [isGoogleOpen, setGoogleOpen] = useState(false);
  const [isBingOpen, setBingOpen] = useState(false);

  if (useWallet === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Do you want to use Wallet or Theta address?</h1>
        <div className="flex space-x-4">
          <button onClick={() => setUseWallet(true)} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Use Wallet
          </button>
          <button onClick={() => setUseWallet(false)} className="px-6 py-3 bg-green-500 text-white rounded-lg">
            Use Theta address
          </button>
        </div>
        <button onClick={() => setHowToPlayOpen(!isHowToPlayOpen)} className="mt-4 px-6 py-3 bg-gray-500 text-white rounded-lg">
          How to Play
        </button>
        {isHowToPlayOpen && (
          <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
            <p>Instructions for the game go here...</p>
          </div>
        )}
      </div>
    );
  }

  if (difficulty === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Choose Difficulty</h1>
        <div className="flex space-x-4">
          <button onClick={() => setDifficulty('easy')} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Easy
          </button>
          <button onClick={() => setDifficulty('medium')} className="px-6 py-3 bg-yellow-500 text-white rounded-lg">
            Medium
          </button>
          <button onClick={() => setDifficulty('hard')} className="px-6 py-3 bg-red-500 text-white rounded-lg">
            Hard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Guess the Title of the Video</h1>
        <progress value={progress} max="100" className="w-full mb-4" />
        <Card post={tagPostsArray[currentIndex]} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your guess"
          className="mt-4 p-2 border rounded"
        />
        <button onClick={handleGuess} className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg">
          Submit
        </button>
        <p className="mt-2 text-gray-600">Score: {score}</p>
        <p className="mt-2 text-gray-600">Time Left: {timer} seconds</p>
        <p className="mt-2 text-gray-600">Guesses Left: {guesses}</p>
        {motivationalMessage && <p className="mt-2 text-green-500">{motivationalMessage}</p>}
      </div>
      <div className="w-1/3 p-4">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="px-6 py-2 bg-gray-500 text-white rounded-lg">
          Toggle Sidebar
        </button>
        {isSidebarOpen && (
          <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-2">Sidebar Content</h2>
            <ul>
              {tagPostsArray.map((post, index) => (
                <li key={index}>
                  <Link href={`/read/${post.title.toLowerCase().trim().split(' ').join('-')}`}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="w-1/3 p-4">
        <button onClick={() => setGoogleOpen(!isGoogleOpen)} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          Google
        </button>
        {isGoogleOpen && (
          <iframe
            src="https://www.google.com"
            width="100%"
            height="600px"
            className="mt-4 rounded-lg"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        <button onClick={() => setBingOpen(!isBingOpen)} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          Bing
        </button>
        {isBingOpen && (
          <iframe
            src="https://www.bing.com"
            width="100%"
            height="600px"
            className="mt-4 rounded-lg"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
}

export default Tags;
