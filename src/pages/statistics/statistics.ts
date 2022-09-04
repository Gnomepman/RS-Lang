import Page from '../../components/templates/page';
import './statistics.scss'
import Api from '../../components/api/api';
import { API_URL, miniGameStatistics, statistics } from '../../components/api/types';
import error from '../../assets/404-error.svg'

export default class StatisticsPage extends Page {
  private api: Api;
  private statistics: statistics | [];

  constructor(id: string) {
    super(id);
    this.api = new Api(API_URL);
    this.statistics = [];
    (async () => await this.getStatistics())()
    
  }

  async getStatistics() {
    this.statistics = await this.api.getUserStatistics() as statistics;
    console.log('Method for statistics: ', this.statistics)
  }

  generateGamestats(game_name: 'sprint' | 'audio_call', array: miniGameStatistics){
    const block = this.createDivBlock('game_statistics');
    const header = document.createElement('h2');
    header.textContent = game_name;
    const short_stats_block = this.createDivBlock('short_stats');
    
    const correct_guessed_words_wrapper = this.createDivBlock('block_desc');
    const correct_guessed_words_count = document.createElement('span');
    correct_guessed_words_count.classList.add("block_desc_count");
    correct_guessed_words_count.textContent = array.correct_guessed_words ? String(array.correct_guessed_words) : '0';
    const correct_guessed_words_desc = document.createElement('p');
    correct_guessed_words_desc.classList.add("block_desc_desc");
    correct_guessed_words_desc.textContent = 'number of words you have guessed correctly';

    const wrong_guessed_words_wrapper = this.createDivBlock('block_desc');
    const wrong_guessed_words_count = document.createElement('span');
    wrong_guessed_words_count.classList.add("block_desc_count");
    wrong_guessed_words_count.textContent = array.wrong_guessed_words ? String(array.wrong_guessed_words) : '0';
    const wrong_guessed_words_desc = document.createElement('p');
    wrong_guessed_words_desc.classList.add("block_desc_desc");
    wrong_guessed_words_desc.textContent = 'number of words you have guessed wrongly';

    const longest_streak_wrapper = this.createDivBlock('block_desc');
    const longest_streak_count = document.createElement('span');
    longest_streak_count.classList.add("block_desc_count");
    longest_streak_count.textContent = array.longest_streak ? String(array.longest_streak) : '0';
    const longest_streak_desc = document.createElement('p');
    longest_streak_desc.classList.add("block_desc_desc");
    longest_streak_desc.textContent = 'Your longest streak';

    short_stats_block.append(correct_guessed_words_wrapper, wrong_guessed_words_wrapper, longest_streak_wrapper);


    block.append(header, short_stats_block);
    return block;
  }

  render() {
    //if user is anonymous
    if (!localStorage.user){
      const block = this.createDivBlock('no_statistics');
      const description = document.createElement('h1');
      description.textContent = 'Statistics is only for loged in users';
      description.id = "desc-error";
      const img = document.createElement('img')
      img.src = error;
      img.id = "img-error";
      block.append(img, description);
      this.container.append(block);
      return this.container
    }

    //if user is loged in
    const wrapper = this.createDivBlock('statistics_wrapper');
    const header = document.createElement('h2');
    header.classList.add('statistics_header');
    header.textContent = 'Statistics';

    if(typeof this.statistics === 'number'){
      //No statistics, display something
      //return this.container
    }
    const stats = this.statistics as statistics;
    console.log('Stats in render: ', this.statistics)

    const words_learned_wrapper = this.createDivBlock('block_desc');
    const words_learned_count = document.createElement('span');
    words_learned_count.classList.add("block_desc_count");
    words_learned_count.textContent = stats.learnedWords ? String(stats.learnedWords) : '0';
    const words_learned_desc = document.createElement('p');
    words_learned_desc.classList.add("block_desc_desc");
    words_learned_desc.textContent = 'number of words you have learned so far';

    words_learned_wrapper.append(words_learned_count, words_learned_desc);
    //wrapper.append(header, words_learned_wrapper, this.generateGamestats('sprint', stats.optional.sprint!));
    this.container.append(wrapper);
    return this.container;
  }
}