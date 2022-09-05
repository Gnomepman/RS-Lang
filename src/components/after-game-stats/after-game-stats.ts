import './after-game-stats.scss'
import Component from '../templates/component';
import Word, { API_URL } from '../api/types';


export default class After_game_stats extends Component {
    private correctWords: Word[];
    private wrongWords: Word[];

    constructor(tagName: string, className: string, correctWords: Word[], wrongWords: Word[]) {
        super(tagName, className);
        this.correctWords = correctWords;
        this.wrongWords = wrongWords;
    }

    render() {
        const title = document.createElement('h2');
        title.classList.add('stats_title');
        title.textContent = 'Lets see how you did';

        const titleCorrect = document.createElement('h3');
        titleCorrect.classList.add('stats_subtitle');
        titleCorrect.classList.add('correct');
        titleCorrect.textContent = `Words you guessed correctly - ${this.correctWords.length}`;

        const correctBlock = document.createElement('div');
        correctBlock.classList.add('stats_wrapper');
        if (this.wrongWords.length === 0) {
            const block = document.createElement('p');
            block.className = 'such_empty'
            block.textContent = 'Wow, such empty...'
            correctBlock.append(block);
        }
        this.correctWords.forEach(word => {
            const element = document.createElement('div');
            element.classList.add("word");
            const audio = new Audio();
            audio.src = `${API_URL}/${word.audio}`;
            const play_audio = document.createElement('button');
            play_audio.innerText = "🔊";
            play_audio.addEventListener("click", () => {
              audio.play();
            });
            const original = document.createElement("p");
            original.classList.add('original');
            original.textContent = word.word;
            const translation = document.createElement('p');
            translation.classList.add('translation');
            translation.textContent = `- ${word.wordTranslate}`;
            element.append(play_audio, original, translation);
            correctBlock.append(element);
        })

        const titleWrong = document.createElement('h3');
        titleWrong.classList.add('stats_subtitle');
        titleWrong.classList.add('wrong');
        titleWrong.textContent = `Words you didn't guess - ${this.wrongWords.length}`;

        const wrongBlock = document.createElement('div');
        wrongBlock.classList.add('stats_wrapper');
        if (this.wrongWords.length === 0) {
            const block = document.createElement('p');
            block.className = 'such_empty'
            block.textContent = 'Wow, such empty...'
            wrongBlock.append(block);
        }
        this.wrongWords.forEach(word => {
            const element = document.createElement('div');
            element.classList.add("word")
            const audio = new Audio();
            audio.src = `${API_URL}/${word.audio}`;
            const play_audio = document.createElement('button');
            play_audio.innerText = "🔊";
            play_audio.addEventListener("click", () => {
              audio.play();
            });
            const original = document.createElement('p');
            original.classList.add('original');
            original.textContent = word.word;
            const translation = document.createElement('p');
            translation.classList.add('translation');
            translation.textContent = `- ${word.wordTranslate}`;
            element.append(play_audio, original, translation);
            wrongBlock.append(element);
        })
        this.container.append(title, titleCorrect, correctBlock, titleWrong, wrongBlock);
        return this.container;
      }
}