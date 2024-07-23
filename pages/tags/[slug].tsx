import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Card from '@/components/Card';
import { posts } from '@/data/posts';
import { type Posts } from '@/type';
import { GetStaticPropsContext } from 'next';

export async function getStaticProps(context: GetStaticPropsContext) {
  const { slug } = context.params!;
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

function Tags({ tagPosts }: { tagPosts: string }) {
  const router = useRouter();
  const tagName = router.query.slug as string;
  const tagPostsArray: Posts[] = JSON.parse(tagPosts);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(600);
  const [input, setInput] = useState('');
  const [account2, setAccount2] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
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
        // Ethereum transaction script
        const Tx = require('ethereumjs-tx').Transaction;
        const Web3 = require('web3');
        const web3 = new Web3('https://eth-rpc-api.thetatoken.org/rpc');
        const chainID = 366;
        const account1 = '0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A';
        const privateKey1 = Buffer.from('1111111111111111111111111111111111111111111111111111111111111111', 'hex');

        web3.eth.getTransactionCount(account1, (err, txCount) => {
          const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: account2,
            value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('4000', 'gwei')),
            chainId: chainID,
          };

          const tx = new Tx(txObject);
          tx.sign(privateKey1);
          const serializedTx = tx.serialize();
          const raw = '0x' + serializedTx.toString('hex');

          web3.eth.sendSignedTransaction(raw, (err, txHash) => {
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
        <h1 className="text-3xl font-bold mb-4">Choose Mode</h1>
        <div className="flex space-x-4">
          <button onClick={() => setUseWallet(false)} className="px-6 py-3 bg-purple-500 text-white rounded-lg">
            Use Without Theta Wallet address
          </button>
          <button onClick={() => setUseWallet(true)} className="px-6 py-3 bg-green-500 text-white rounded-lg">
            Use With Wallet Theta address
          </button>
        </div>
        <button onClick={() => setHowToPlayOpen(!isHowToPlayOpen)} className="mt-4 px-6 py-3 bg-gray-500 text-white rounded-lg">
          How to Play
        </button>
        {isHowToPlayOpen && (
          <div className="mt-4 p-4 bg-orange-200 rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-black">How to Play</h2>
            <p className="mb-2 text-black">
              Players input prompts as fast as possible to answer questions from AI-generated images, videos, audio, and pictures.
              Use the two AI features at the bottom left corner for chat assistance.
              Get a Theta wallet address from <a href="https://wallet.thetatoken.org/" className="text-black underline">Here</a>.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (useWallet && account2 === '') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Enter Account2 Address</h1>
        <input
          type="text"
          value={account2}
          onChange={(e) => setAccount2(e.target.value)}
          className="mb-4 px-4 py-2 border rounded-lg"
          placeholder="Enter your account2 address"
        />
        <button onClick={() => setDifficulty('easy')} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          Proceed to Game
        </button>
      </div>
    );
  }

  if (difficulty === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Select Difficulty</h1>
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg" onClick={() => setDifficulty('easy')}>Easy</button>
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg" onClick={() => setDifficulty('medium')}>Medium</button>
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg" onClick={() => setDifficulty('hard')}>Hard</button>
        </div>
      </div>
    );
  }

  const currentPost = tagPostsArray[currentIndex];

  return (
    <div>
      <aside aria-label="Articles" className="py-8 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-screen-xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Hint related to: {tagName.replaceAll("-", " ")}
          </h2>

          <div className="mt-8 flex flex-col items-center">
            <div className="container my-12 mx-auto flex justify-center items-center">
              <div className="grid grid-cols-1 gap-12 md:gap-12 lg:gap-12 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
                {currentPost && <Card key={currentPost.id} item={currentPost} />}
              </div>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mb-4 px-4 py-2 border rounded-lg"
              placeholder="Enter your guess"
            />
            <button onClick={handleGuess} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
              Submit
            </button>
            <p className="mt-4">Time left: {timer} seconds</p>
            <p className="mt-2">Score: {score}</p>
            <p className="mt-2 text-green-500">{motivationalMessage}</p>
            <div className="relative pt-1 w-full">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-pink-600">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                <div
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress >= 80 ? 'green' : 'brown',
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-4 right-4 flex space-x-4">
        <button
          onClick={() => setGoogleOpen(!isGoogleOpen)}
          className="px-4 py-2 bg-gray-800 text-white rounded-full flex items-center"
        >
          <img src="/chat-icon.png" alt="Chat Icon" className="w-6 h-6 mr-2" />
          Llama
        </button>
        <button
          onClick={() => setBingOpen(!isBingOpen)}
          className="px-4 py-2 bg-gray-800 text-white rounded-full flex items-center"
        >
          <img src="/chat-icon.png" alt="Chat Icon" className="w-6 h-6 mr-2" />
          AI2
        </button>
      </div>

      {isGoogleOpen && (
        <div className="fixed bottom-0 right-0 w-1/3 h-1/2 bg-white border border-gray-300 shadow-lg overflow-hidden">
          <button
            onClick={() => setGoogleOpen(false)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2"
          >
            &times;
          </button>
          <iframe src="https://wind-theta-five.vercel.app/" className="w-full h-full"></iframe>
        </div>
      )}
      {isBingOpen && (
        <div className="fixed bottom-0 right-0 w-1/3 h-1/2 bg-white border border-gray-300 shadow-lg overflow-hidden">
          <button
            onClick={() => setBingOpen(false)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2"
          >
            &times;
          </button>
          <iframe src="https://gemini-chat-eight-bice.vercel.app/" className="w-full h-full"></iframe>
        </div>
      )}
    </div>
  );
}

export default Tags;
