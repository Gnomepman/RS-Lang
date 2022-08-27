import './sprint_game.scss';
import Page from '../../components/templates/page';
import Api from '../../components/api/api';
import Word from '../../components/api/types'
import { API_URL } from '../../components/api/types';
import Timer from '../../components/timer/timer';

export default class Sprint_game extends Page {
  private group: number;
  private page: number[];
  private words: Word[];
  private api: Api;
  private correctWords: Word[];
  private wrongWords: Word[];
  private guessedWordsInARow: number;

  constructor(id: string, group?: number, page?: number) {
    super(id);
    this.api = new Api(API_URL);
    this.words = [];
    this.correctWords = [];
    this.wrongWords = [];
    this.page = [];
    this.guessedWordsInARow = 0;

    if(page){
      this.page.push(page);
    } else {
      const rand = Sprint_game.randomIntFromIntervalWithoutRepeat(1,30);
      for (let i = 0; i < 3; i++){
        this.page.push(rand());
      }
    }
    
    if (group) {
      this.group = group;
      (async () => await this.getWords())()
    } else {
      this.group = -1;
    }
  }

  async getWords() {
    this.page.forEach(async page => {
      let temp = await this.api.getWords(page, this.group)
      this.words = this.words.concat(temp);
    })
   // this.words = await this.api.getWords(this.page, this.group);
    console.log(`Group: ${this.group}, page ${this.page}`)
    //console.log('Words from api', this.words);
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomIntFromIntervalWithoutRepeat(min: number, max: number) {
    const prev: number[] = [];
    return function () {
      let random_number: number;
      do {
        random_number = Math.floor(Math.random() * (max - min + 1) + min);
      } while (!(prev.indexOf(random_number) === -1));
      prev.pop();
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
        this.renderTimer(wrapper);
      });
      groups.append(button);
    }
    choose_group.append(groups);
    wrapper.append(choose_group);
  }

  renderTimer(wrapper: HTMLDivElement) {
    const timer = new Timer("div", "timer", 5).render();
    timer.addEventListener("countDown", () => {
      timer.remove();
      this.renderGameWindow(wrapper);
    });
    wrapper.append(timer);
  }

  generateСard() {
   // console.log(this.words)
    if (document.querySelector(".game_window") !== null) {
      //console.log("Game is still on, generating card");
      let arrayOfWords = [...this.words];
      const indexForWordToChoose = Sprint_game.randomIntFromIntervalWithoutRepeat(0, arrayOfWords.length - 1)
      const fakeOrRealTranslation = Boolean(this.randomIntFromInterval(0, 1));
      const wordToGuess = arrayOfWords[indexForWordToChoose()];
      //Card itself
      const card = this.createDivBlock("card");
      //Word (original)
      const word_original = document.createElement("a");
      word_original.classList.add("original");
      const word_translation = document.createElement("a");
      word_original.classList.add("translation");
      word_original.textContent = wordToGuess.word;
      //Buttons
      const buttonsWrapper = this.createDivBlock("buttons_wrapper");
      const leftButton = document.createElement("button");
      leftButton.classList.add('wrong')
      const rightButton = document.createElement("button");
      rightButton.classList.add('right')
      leftButton.textContent = "Wrong";
      rightButton.textContent = "Correct";

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

      const correctGuess = () => {
        if (this.correctWords.indexOf(wordToGuess) === -1){this.correctWords.push(wordToGuess)}
        document.querySelector(".card")?.remove()
        if(this.guessedWordsInARow !== 3){
          this.guessedWordsInARow++;
        } else {
          this.guessedWordsInARow = 0
        }
        console.log("Counter: ", this.guessedWordsInARow);
        //document.removeEventListener('keypress', eventFunction)
      }

      const wrongGuess = () => {
        if (this.wrongWords.indexOf(wordToGuess) === -1){this.wrongWords.push(wordToGuess)}
        document.querySelector(".card")?.remove()
        //document.removeEventListener('keypress', eventFunction)
        //all birds/humans resets to 0
        if(this.guessedWordsInARow !== 0) this.guessedWordsInARow--;
        console.log("Counter: ", this.guessedWordsInARow);
      }

      if (fakeOrRealTranslation) {//Case when translations match
        word_translation.textContent = wordToGuess.wordTranslate;
        rightButton.addEventListener("click", correctGuess);
        leftButton.addEventListener("click", wrongGuess);
      } else {//Case when translations do not match
        word_translation.textContent = arrayOfWords[indexForWordToChoose()].wordTranslate;
        rightButton.addEventListener("click", wrongGuess);
        leftButton.addEventListener("click", correctGuess);
      }

      const indicators = this.createDivBlock('indicators');
      for (let i = 0; i < 3; i++){
        const indicator = this.createDivBlock('indicator')
        indicators.append(indicator)
      }

      for (let i = 0; i < this.guessedWordsInARow; i++){
        indicators.children[i].classList.add("active");
      }

      buttonsWrapper.append(leftButton, rightButton);
      card.append(indicators, word_original, word_translation, buttonsWrapper);
      return card;
    }
  }

  renderGameWindow(wrapper: HTMLDivElement) {
    const game_window = this.createDivBlock("game_window");
    const TIME_FOR_GAME = 600; //in seconds
    let timer = new Timer("div", "timer", TIME_FOR_GAME).render();

    timer.addEventListener("countDown", () => {
      //console.log("Game timer is out");
      game_window.remove();
      console.log('Correct: ', this.correctWords, '\nWrong: ', this.wrongWords)
      //Then we renderStatistics, by passing two arrays
    });

    game_window.append(timer);
    wrapper.append(game_window);

    setInterval(() => {
      if (document.querySelector(".timer") !== null && !document.querySelector(".card")) {
        //console.log("Game timer is still on, starting generating card");
        game_window.append(this.generateСard()!);
      }
    }, 50);
  }

  render() {
    const wrapper = this.createDivBlock("sprint_wrapper");
    if (this.group === -1) {
      this.renderChooseGroup(wrapper);
    } else {
      this.renderTimer(wrapper);
    }

    this.container.append(wrapper);
    return this.container;
  }
}