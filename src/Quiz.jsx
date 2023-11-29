import React, { useState, useEffect } from 'react';
import './Quiz.css';
import questionsData from './questions.json';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      const questionsWithTime = questionsData.results.map((question, index) => ({
        ...question,
        temps: 60,
        id: index,
      }));

      questionsWithTime.forEach((question) => {
        question.all_answers = shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
        ]);
      });

      setQuestions(questionsWithTime);
    }
  }, [quizStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0 && quizStarted) {
        setTimer(timer - 1);
      } else if (timer === 0 && quizStarted) {
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerClick = (selectedAnswer) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);

    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    moveNextQuestion();
  };

  const handleTimeUp = () => {
    moveNextQuestion();
  };

  const moveNextQuestion = () => {
    setTimer(60);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    setShowCorrectAnswer(true);
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <div>
      {!quizStarted ? (
        <div>
          <h2 className='titre'>Bienvenue dans le Quiz React! <br />
            Testez vos connaissances en React en répondant à ces questions.</h2>
          <button onClick={handleStartQuiz} id='btn'>Commencer le Quiz</button>
        </div>
      ) : !quizFinished ? (
        <div className="Quiz">
          <h1>Quiz App</h1>
          <p>Temps restant: {timer} secondes</p>
          <progress value={timer} max="60"></progress>
          <p>{`Question ${currentQuestion + 1}/${questions.length}`}</p>
          {questions.length > 0 && currentQuestion < questions.length && (
            <div>
              <p>{questions[currentQuestion].question}</p>
              <ul>
                {questions[currentQuestion].all_answers.map((answer, index) => (
                  <li key={index} onClick={() => handleAnswerClick(answer)}>
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className={score >= Math.ceil(questions.length / 2) ? 'score-green' : 'score-red'}>
            Quiz terminé! <br />
            Score final: {Math.round((score / questions.length) * 20)} / 20
            {score >= Math.ceil(questions.length / 2) ? (
              <img src={`./img/good.png`} alt="Green" />
            ) : (
              <img src={`./img/faild.png`} alt="Red" />
            )}
       
          {quizFinished && !showAnswers && (
            <button onClick={() => setShowAnswers(true)} className='btn1'>
              Afficher les réponses
            </button>
            
          )}
            
          {showCorrectAnswer && showAnswers && (
            <div className="AnswersSection">
              <h3>Réponses:</h3>
              {questions.map((question, index) => (
                <div key={index} className="QuestionContainer">
                  <p className="QuestionText">{`Question ${index + 1}: ${question.question}`}</p>
                  {userAnswers[index] === question.correct_answer ? (
                    <p className="UserAnswerCorrect">{`Votre réponse: ${userAnswers[index]}`}</p>
                  ) : (
                    <div>
                      <p className="UserAnswerIncorrect">{`Votre réponse: ${userAnswers[index]}`}</p>
                      <p className="CorrectAnswer">{`Réponse correcte: ${question.correct_answer}`}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
           </h2>
        </div>
      )}
    </div>
  );
}

export default Quiz;
