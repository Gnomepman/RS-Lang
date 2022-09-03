import "./audio_game.scss";
import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import Word from "../../components/api/types";
import { API_URL } from "../../components/api/types";
import Timer from "../../components/timer/timer";

interface IVariants {
  word: string;
  wordTranslate: string;
  wordAudio: string;
  multipleChoice: string[];
}

export default class Audio_game extends Page {
  private group: number;
  private page: number;
  private words: Word[];
  private api: Api;
  private correctWords: Word[];
  private wrongWords: Word[];
  private guessedWordsInARow: number;
  private countingWord: number;
  private variants: IVariants[];

  constructor(id: string, group?: number, page?: number) {
    super(id);
    this.api = new Api(API_URL);
    this.words = [];
    this.correctWords = [];
    this.wrongWords = [];
    this.guessedWordsInARow = 0;
    this.countingWord = 1;
    this.variants = [];

    page ? (this.page = page) : (this.page = this.randomIntFromInterval(0, 29));

    if (group) {
      this.group = group;
      (async () => await this.getWords())();
    } else {
      this.group = -1;
    }
  }

  async getWords() {
    this.words = await this.api.getWords(this.page, this.group);

    setTimeout(() => {
      this.words.forEach((item) => {
        let variantObject: IVariants = {
          word: item.word,
          wordTranslate: item.wordTranslate,
          wordAudio: item.audio,
          multipleChoice: [
            item.wordTranslate,
            this.words[this.randomIntFromInterval(0, 4)].wordTranslate,
            this.words[this.randomIntFromInterval(4, 8)].wordTranslate,
            this.words[this.randomIntFromInterval(8, 12)].wordTranslate,
            this.words[this.randomIntFromInterval(12, 16)].wordTranslate,
            // this.words[this.randomIntFromInterval(min, max)].wordTranslate
          ],
        };
        this.variants.push(variantObject);
      });
    }, 100);
  }

  shuffleArray(arr: string[]) {
    return arr.sort(() => Math.random() - 0.5);
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static intervalWithoutRepeat(min: number, max: number) {
    const prev: number[] = [];

    return function () {
      let random_number: number = 0;
      do {
        random_number = Math.floor(Math.random() * (max - min + 1) + min);
      } while (!(prev.indexOf(random_number) === -1));
      prev.push(random_number);
      return random_number;
    };
  }

  renderChooseGroup(wrapper: HTMLDivElement) {
    const choose_group = this.createDivBlock("choose_group");
    const label = document.createElement("h2");
    label.textContent = "Choose group of words";
    choose_group.append(label);
    const groups = this.createDivBlock("groups_to_choose");
    for (let i = 0; i < 6; i++) {
      const button = document.createElement("button");
      button.textContent = String(i + 1);
      button.id = String(i + 1);
      button.addEventListener("click", async () => {
        choose_group.remove();
        this.group = Number(button.textContent);
        await this.getWords();
        this.renderStartTimer(wrapper);
      });
      groups.append(button);
    }
    choose_group.append(groups);
    wrapper.append(choose_group);
  }

  renderStartTimer(wrapper: HTMLDivElement) {
    const timer = new Timer("div", "timer", 5).render();
    timer.addEventListener("countDown", () => {
      timer.remove();
      this.renderGameWindow(wrapper);
    });
    wrapper.append(timer);
  }

  generateСard() {
    if (document.querySelector(".audio_game") !== null) {
      let arrayOfWords = [...this.words];
      let multipleChoices = [...this.variants];

      const indexForWord = Audio_game.intervalWithoutRepeat(
        0,
        arrayOfWords.length - 1
      );
      const wordToGuess = arrayOfWords[indexForWord()];

      // Multiple choice variants
      this.shuffleArray(
        multipleChoices[arrayOfWords.indexOf(wordToGuess)].multipleChoice
      );

      //Card itself
      const card = this.createDivBlock("audio_card");

      // Counter of words
      const countingWords = document.createElement("span");
      countingWords.classList.add("words_counter");
      countingWords.innerText = `${this.countingWord}/${arrayOfWords.length}`;

      // Audio
      let audio = new Audio();
      audio.src = `${API_URL}/${wordToGuess.audio}`;

      const audioContainer = document.createElement("div");
      audioContainer.innerHTML = `
          <audio autoplay>
              <source src="${API_URL}/${wordToGuess.audio}" type="audio/mpeg">
          </audio>
      `;
      const audioButton = document.createElement("button");
      audioButton.classList.add("audio_button");
      audioButton.innerText = "🔊";
      audioButton.addEventListener("click", () => {
        audio.play();
      });

      audioContainer.append(audioButton);

      //Word (original)
      const word_original = document.createElement("div");
      word_original.classList.add("original");

      const word_pronounce = document.createElement("button");
      word_pronounce.innerText = "🔈";

      word_pronounce.addEventListener("click", () => {
        audio.play();
      });

      const word_original_title = document.createElement("h6");
      word_original_title.innerText = `${wordToGuess.word}`;

      word_original.append(word_pronounce, word_original_title);
      word_original.style.display = "none";

      // Image
      let image = new Image();
      image.src = `${API_URL}/${wordToGuess.image}`;
      image.alt = wordToGuess.word;
      image.classList.add("word_image");
      image.style.display = "none";

      //Buttons
      const buttonsWrapper = this.createDivBlock("buttons_wrapper");
      const variantsWrapper = this.createDivBlock("variants_wrapper");

      const showAnswer = document.createElement("button");
      const nextButton = document.createElement("button");
      nextButton.style.display = "none";

      const correctGuess = () => {
        // if (this.correctWords.indexOf(wordToGuess) === -1) {
        //   this.correctWords.push(wordToGuess);
        // }

        this.correctWords.push(wordToGuess);

        this.countingWord++;
        document.querySelector(".audio_card")?.remove();

        if (this.guessedWordsInARow !== 3) {
          this.guessedWordsInARow++;
        } else {
          this.guessedWordsInARow = 0;
        }
        //document.removeEventListener('keypress', eventFunction)
      };

      const wrongGuess = () => {
        this.wrongWords.push(wordToGuess);

        this.countingWord++;
        document.querySelector(".audio_card")?.remove();
        //document.removeEventListener('keypress', eventFunction)
      };

      const showAnswerFunction = () => {
        word_original.style.display = "flex";
        image.style.display = "block";
        audioContainer.style.display = "none";
        nextButton.style.display = "block";
        showAnswer.setAttribute("disabled", "true");
      };

      for (let i = 0; i < 5; i++) {
        const choiceButton = document.createElement("button");
        choiceButton.textContent = `${
          multipleChoices[arrayOfWords.indexOf(wordToGuess)].multipleChoice[i]
        }`;

        choiceButton.addEventListener("click", () => {
          if (choiceButton.innerText === wordToGuess.wordTranslate) {
            choiceButton.style.backgroundColor = "green";
            showAnswerFunction();
            nextButton.addEventListener("click", correctGuess);
          } else if (choiceButton.innerText !== wordToGuess.wordTranslate) {
            choiceButton.style.backgroundColor = "red";
            showAnswerFunction();
            nextButton.addEventListener("click", wrongGuess);
          }
        });

        variantsWrapper.append(choiceButton);
      }

      showAnswer.addEventListener("click", () => {
        showAnswerFunction();
        nextButton.addEventListener("click", wrongGuess);
      });

      showAnswer.textContent = "Don't know ❓";
      nextButton.textContent = "Next ⏭️";

      // const eventFunction = (e: KeyboardEvent) => {
      //   //console.log(e)
      //   if (e.code === "ArrowRight") {
      //     console.log(e.code);
      //     rightButton.click();
      //   }
      //   if (e.code === "ArrowRight") {
      //     console.log(e.code);
      //     rightButton.click();
      //   }
      // };
      //document.addEventListener("keypress", eventFunction)

      buttonsWrapper.append(showAnswer, nextButton);

      card.append(
        countingWords,
        image,
        audioContainer,
        word_original,
        variantsWrapper,
        buttonsWrapper
      );

      return card;
    }
  }

  resultsMenuButton(): HTMLDivElement {
    const buttonsContainer = this.createDivBlock("results_buttons");

    buttonsContainer.innerHTML = `
      <a href="#main-page" class="results_home_page">🏚️ Home page</a>
      <a href="#mini-games-page" class="results_game_page">🎮 Mini games page</a>
    `;

    return buttonsContainer;
  }

  renderResultingWords() {
    // Removing all duplicates
    // this.correctWords = [...new Set(this.correctWords)];
    // this.wrongWords = [...new Set(this.wrongWords)];

    const finalResults = document.createElement("div");
    finalResults.classList.add("results");

    const finalTitle = document.createElement("h1");
    finalTitle.classList.add("results_title");

    const correctsAmount = document.createElement("h3");
    correctsAmount.classList.add("corrects_title");

    const wrongsAmount = document.createElement("h3");
    wrongsAmount.classList.add("wrongs_title");

    const listOfCorrects = document.createElement("div");
    listOfCorrects.classList.add("correct_list");

    correctsAmount.innerText = `Correct words: ${this.correctWords.length}`;

    this.correctWords.forEach((item) => {
      let audio = new Audio();
      audio.src = `${API_URL}/${item.audio}`;

      const correctWord = document.createElement("div");
      const audio_btn = document.createElement("button");

      audio_btn.innerText = "🔊";
      audio_btn.addEventListener("click", () => {
        audio.play();
      });

      correctWord.innerHTML = `
        <p>
          <span class="word">${item.word}</span> - <span>${item.wordTranslate}</span>
        </p>
      `;

      correctWord.append(audio_btn);
      listOfCorrects.append(correctWord);
    });

    const listOfWrongs = document.createElement("div");
    listOfWrongs.classList.add("wrong_list");

    wrongsAmount.innerText = `Mistaken words: ${this.wrongWords.length}`;

    this.wrongWords.forEach((item) => {
      let audio = new Audio();
      audio.src = `${API_URL}/${item.audio}`;

      const wrongWord = document.createElement("div");
      const audio_btn = document.createElement("button");

      audio_btn.innerText = "🔊";
      audio_btn.addEventListener("click", () => {
        audio.play();
      });

      wrongWord.innerHTML = `
        <p>
          <span class="word">${item.word}</span> - <span>${item.wordTranslate}</span>
        </p>
      `;

      wrongWord.append(audio_btn);
      listOfWrongs.append(wrongWord);
    });

    if (this.correctWords.length > 12) {
      finalTitle.innerText = "Congratulations, great result!";
    } else if (this.correctWords.length > 5) {
      finalTitle.innerText = "Good job, but keep practicing!";
    } else {
      finalTitle.innerText = "It didn't work this time, but keep practicing!";
    }

    finalResults.append(
      finalTitle,
      correctsAmount,
      listOfCorrects,
      wrongsAmount,
      listOfWrongs
    );

    return finalResults;
  }

  renderGameWindow(wrapper: HTMLDivElement) {
    const game_window = this.createDivBlock("audio_game");
    const resultsMenu = this.resultsMenuButton();
    resultsMenu.style.display = "none";

    wrapper.append(game_window, resultsMenu);

    let intervalRender = setInterval(() => {
      if (!document.querySelector(".audio_card") && this.countingWord <= 20) {
        game_window.append(this.generateСard()!);
      }

      // Rendering final results
      if (this.countingWord > 20) {
        clearInterval(intervalRender);

        resultsMenu.style.display = "flex";
        game_window.append(this.renderResultingWords());
      }
    }, 50);
  }

  render() {
    const wrapper = this.createDivBlock("audio_container");
    if (this.group === -1) {
      this.renderChooseGroup(wrapper);
    } else {
      this.renderStartTimer(wrapper);
    }

    this.container.append(wrapper);
    return this.container;
  }
}
