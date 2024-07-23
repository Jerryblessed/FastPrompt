import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Card from '@/components/Card';
import { posts } from '@/data/posts';
import { type Posts } from '@/type';
import { Buffer } from 'buffer';
import Web3 from 'web3';
import { Transaction } from 'ethereumjs-tx';

interface Props {
  tagPosts: string;
}

interface Post {
  id: number;
  title: string;
  tags: string[];
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
            <h2 className="text-xl font-bold mb-2 text-center">How to Play</h2>
            <p className="text-center">
              Welcome to Guess the Post! You have three difficulty levels to choose from: Easy, Medium, and Hard. Each level has a
              different time limit and number of guesses allowed. Try to guess the title of the post based on the tags. Enter your guess in
              the input box and click 'Submit Guess'. If you get it right, your score will increase and you'll move on to the next post.
              If you choose to play with a Theta wallet, you will receive a 25 Tfuel reward for each correct guess. Good luck and have fun!
            </p>
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
          <button onClick={() => setDifficulty('easy')} className="px-6 py-3 bg-green-500 text-white rounded-lg">
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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Guess the Post</h1>
      <div className="mb-4">
        <Card post={tagPostsArray[currentIndex]} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg"
        placeholder="Enter your guess"
      />
      <button onClick={handleGuess} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
        Submit Guess
      </button>
      <p className="mt-4 text-gray-700">Score: {score}</p>
      <p className="text-gray-700">Progress: {progress.toFixed(2)}%</p>
      <p className="text-gray-700">Timer: {timer} seconds</p>
      <p className="text-gray-700">Guesses Left: {guesses}</p>
      {motivationalMessage && <p className="mt-2 text-green-500">{motivationalMessage}</p>}
    </div>
  );
}

export default Tags;
