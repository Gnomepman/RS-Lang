import './after-game-stats.scss'
import Component from '../templates/component';
import Word from '../api/types';


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
        titleCorrect.textContent = 'Words you guessed correctly';

        const correctBlock = document.createElement('div');
        correctBlock.classList.add('stats_wrapper');
        this.correctWords.forEach(word => {
            const element = document.createElement('div');
            element.classList.add("word")
            const original = document.createElement('p');
            original.classList.add('original');
            original.textContent = word.word;
            const translation = document.createElement('p');
            translation.classList.add('translation');
            translation.textContent = word.wordTranslate;
            element.append(original, translation);
            correctBlock.append(element);
        })

        const titleWrong = document.createElement('h3');
        titleWrong.classList.add('stats_subtitle');
        titleWrong.classList.add('wrong');
        titleWrong.textContent = "Words you didn't guess";

        const wrongBlock = document.createElement('div');
        wrongBlock.classList.add('stats_wrapper');
        this.wrongWords.forEach(word => {
            const element = document.createElement('div');
            element.classList.add("word")
            const original = document.createElement('p');
            original.classList.add('original');
            original.textContent = word.word;
            const translation = document.createElement('p');
            translation.classList.add('translation');
            translation.textContent = word.wordTranslate;
            element.append(original, translation);
            wrongBlock.append(element);
        })
        this.container.append(title, titleCorrect, correctBlock, titleWrong, wrongBlock);
        return this.container;
      }
}