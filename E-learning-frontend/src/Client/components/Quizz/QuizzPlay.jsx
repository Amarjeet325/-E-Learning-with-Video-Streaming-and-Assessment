import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

function QuizzScreen() {
  const timerDuration = 30; // Set the duration for each question timer (in seconds)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false); // Track if quiz is finished
  const [quizData, setQuizData] = useState(null); // Store quiz data from local storage

  // Set up the timer using the react-timer-hook
  const { seconds, start, restart } = useTimer({
    expiryTimestamp: new Date().getTime() + timerDuration * 1000,
    onExpire: () => handleNext(), // Move to the next question when the timer expires
  });

  useEffect(() => {
    // Fetch quiz data from local storage
    try {
      const resp = localStorage.getItem('quizzToPlay');
      const data = JSON.parse(resp);
      setQuizData(data); // Set quiz data
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // Start the timer whenever the question changes
    restart(new Date().getTime() + timerDuration * 1000);
    start(); // Start the timer

    // Cleanup function to stop the timer when the component unmounts
    return () => {
      restart(new Date().getTime());
    };
  }, [currentQuestionIndex]);

  const handleNext = () => {
    // Only check the selected option if it exists
    if (selectedOption) {
      // Check if the selected option is correct
      if (selectedOption === quizData.questions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1); // Increment score for correct answer
      }
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setSelectedOption(null); // Clear selected option for the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle end of quiz logic here
      setQuizFinished(true);
    }
  };

  if (!quizData) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="flex flex-col min-w-full justify-between min-h-screen p-4  md:p-8 lg:p-12 ">
      {!quizFinished ? (
        <>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-indigo-600">{quizData.title}</h1>
            <p className="text-lg mt-2 text-gray-700">{quizData.description}</p>
            <p className="text-md mt-2 text-gray-500">Category: {quizData.category}</p>
          </div>
          <div className="bg-indigo-500 h-18 w-full flex items-center justify-between rounded-t-lg px-4 py-4">
            <h2 className="text-lg md:text-2xl font-semibold text-white">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </h2>
            <div className="text-lg md:text-xl font-semibold text-yellow-400">
              {Math.floor(seconds / 60)}:{seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
            </div>
          </div>
          <div className="flex flex-col flex-grow space-y-4 w-full relative">
            <div className="bg-white shadow-md rounded-b-lg p-4 flex-grow">
              <h3 className="text-lg md:text-xl font-bold mb-4 text-indigo-900">
                {quizData.questions[currentQuestionIndex].question}
              </h3>
              <ul className="options-list list-none pl-0">
                {quizData.questions[currentQuestionIndex].options.map((option, index) => (
                  <li key={index} className="flex items-center my-5 border rounded-md p-4">
                    <input
                      type="radio"
                      id={option}
                      name="quiz-option"
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)}
                      className="h-6 w-6 radio border-zinc-700"
                    />
                    <label
                      htmlFor={option}
                      className="ml-4 text-base md:text-lg font-medium transition-all duration-300 ease-in-out text-gray-800 hover:text-blue-500"
                    >
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {/* Next Button Section */}
            <div className="absolute bottom-4 right-4 w-fit">
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">Quiz Finished!</h2>
          <p className="text-lg md:text-2xl font-semibold text-gray-700 mb-4">Your Score:</p>
          <p className="text-2xl md:text-4xl font-bold text-indigo-600">{score} / {quizData.questions.length}</p>
          <p className="text-md md:text-lg text-gray-500 mt-4">Thank you for participating!</p>
          <button 
            className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setQuizFinished(false);
            }}
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizzScreen;
