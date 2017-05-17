(()=>{
  // Vanilla javascript Ajax GET Request using Promise
  const GET = (route) => {
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();
      http.open('GET', route);
      http.onreadystatechange = () => {
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
          const data = JSON.parse(http.responseText);
          resolve(data);
        }
      }
      http.send();
    });
  };

  const loadHomePage = () => {
    const container = document.querySelector('.js-contentContainer');

    GET('./api/getPopularMovies').then((res) => {
      const movieArr = res.results;
      for(const movie of movieArr){
        const {title, release_date, id, overview, poster_path} = movie;
        const item = document.createElement('article');
        item.classList.add('itemContainer')
        const imageUrl = "http://image.tmdb.org/t/p/w185/" + poster_path;
        const html = `
          <h2>${title}</h2>
          <img src="${imageUrl}" alt="" />
          <p>${overview}</p>
          <button class="js-takeQuiz ui green button" id="${id}">Take Quiz</button>
        `;
        item.innerHTML = html;
        container.appendChild(item);
      }; //End of For Loop

      container.addEventListener('click', (e) => {
        console.log(e.target.getAttribute("i"));
        if(e.target.getAttribute("id") !== null){
          localStorage.setItem('currentMovieId', e.target.getAttribute("id"));
          window.location.href = "quizPage"
        };
      });
    });//End of getPopularMovies
  };//End of loadHomePage Function

  const loadQuizPage = () => {
    const currentMovieId = localStorage.getItem('currentMovieId');
    const contentContainer = document.querySelector('.js-contentContainer');
    const modal = document.querySelector('.js-modal');

    //GENERATE html
    const generateHTML = (data) => {
      const html = `
        <section class="questionItem">
          <div>
            <h2 class="question">${data}</h2>
          </div>
          <div class="ui input">
            <input type="text" placeholder="answer ... " class="js-userInput">
            <button class="js-submit submit ui teal right labeled icon button">Submit</button>
          </div>
        </section>
      `;
      return html;
    };

    //GET MOVIECAST FOR QUESTIONS
    GET(`./api/${currentMovieId}/getMovieCast`).then((castRes) => {
      const {cast, id} = castRes;
      //GET MOVIE INFORMATION
      GET(`./api/${id}/searchMoviebyId`).then((movie) => {
        //GENERATE QUESTIONS ARRAR
        generateQuestions(cast, movie).then(res => {
          const {questions, answers} = res;
          const randomIndex = Math.floor((Math.random() * 11));
          const html = generateHTML(questions[randomIndex].Question);
          contentContainer.innerHTML = html;

          // SUBMIT ANSWERS WITH BUTTON OR ENDTER KEY
          const userInput = document.querySelector('.js-userInput');
          const submitAnswer = document.querySelector('.js-submit');
          userInput.addEventListener('keydown', (e) => {
            const {keyCode} = e;
            if(keyCode === 13){
              processUserResponse();
            }
          });//userInput keydown Event Listener
          submitAnswer.addEventListener('click', () => processUserResponse())


          //CHECK IF USER RESPONSE IS CORRECT
          const processUserResponse = () => {
            modal.style.display = "flex";
            const modalContent = document.querySelector('.js-modalContent');
            validateInput(userInput.value.toLowerCase()).then((validatedInput) => {
              const answer = answers[randomIndex].Answer.toLowerCase();
              if(validatedInput === answer) {
                modalContent.innerHTML = `
                  <h2> CORRECT </h2>
                  <button class="js-playAgain ui button">Play Again</button>
                `;
              } else {
                modalContent.innerHTML = `
                  <h2> INCORRECT </h2>
                  <h4>The correct answer is ${answer}</h4>
                  <button class="js-playAgain ui green button">Play Again</button>
                `;
              };
              const playAgain = document.querySelector('.js-playAgain');
              playAgain.addEventListener('click', () => {
                window.location.href = "quizPage"
              })
            }).catch(err => {
              console.log(err);
            });
          };

          //Validates Search Query for empty strings *Returns value as promise
          const validateInput = (value) => {
            return new Promise((resolve, reject) => {
                if (value.trim() === "") {
                    reject('Input a valid value');
                }
                resolve(value);
            });
          };

          //CLOSE MODAL WINDOW
          window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
          };

        });//generateQuestions
      });//GETMOVIEBYID
    });//GETMOVIECAST
  }; //LoadQuizPage



  const generateQuestions = (cast, movie) => {
    return new Promise((resolve, reject) => {
      // console.log(cast, crew, movie);
      const {title, release_date} = movie
      const questions = [
        {Question: `In what year was ${title} released?`},
      ];
      const answers = [
        {Answer: release_date.substring(0, 4)}
      ]
      for(let i = 0; i < 10; i++){
        questions.push({Question: `What actor played the role of ${cast[i].character}`})
        answers.push({Answer: cast[i].name})
      }
      resolve({questions, answers})
    }); //End of Promise tag
  }; //generateQuestion Fuction










  //  ##########################
  // TOGGLE CURRENTLY ACTIVE PAGE
  // ##########################
  const templateName = document.querySelector('body').getAttribute('data-template-name');
  if (templateName === 'home') {
    loadHomePage();
  }
  else if (templateName === 'quizPage') {
    loadQuizPage();
  };
})();
