import Page from '../../components/templates/page';
import './statistics.scss'
import Api from '../../components/api/api';
import { API_URL, miniGameStatistics, statistics, statisticsPerSession } from '../../components/api/types';
import error from '../../assets/404-error.svg'
import LoadingAnimation from '../../components/loading-animation/loading-animation';
import { createElement } from '../../components/utils/utils';
import GraphNewWordsPerDay from '../../components/graph/graph';

export default class StatisticsPage extends Page {
  private api: Api;
  statistics: statistics | [];

  constructor(id: string) {
    super(id);
    this.api = new Api(API_URL);
    this.statistics = []; 
  }

  async getStatistics() {
    this.statistics = await this.api.getUserStatistics() as statistics;
  }

  generateGamestats(game_name: 'sprint' | 'audio_call', array: miniGameStatistics){
    const block = this.createDivBlock('game_statistics');
    const header = document.createElement('h2');
    header.textContent = game_name.split('_').join(' ');

    const short_stats_block = this.createDivBlock('short_stats');
    
    const correct_guessed_words_wrapper = this.createDivBlock('block_desc');
    const correct_guessed_words_count = document.createElement('span');
    correct_guessed_words_count.classList.add("block_desc_count");
    correct_guessed_words_count.textContent = array ? String(array.correct_guessed_words) : '0';
    const correct_guessed_words_desc = document.createElement('p');
    correct_guessed_words_desc.classList.add("block_desc_desc");
    correct_guessed_words_desc.textContent = 'number of words you have guessed correctly';
    correct_guessed_words_wrapper.append(correct_guessed_words_count, correct_guessed_words_desc);

    const wrong_guessed_words_wrapper = this.createDivBlock('block_desc');
    const wrong_guessed_words_count = document.createElement('span');
    wrong_guessed_words_count.classList.add("block_desc_count");
    wrong_guessed_words_count.textContent = array ? String(array.wrong_guessed_words) : '0';
    const wrong_guessed_words_desc = document.createElement('p');
    wrong_guessed_words_desc.classList.add("block_desc_desc");
    wrong_guessed_words_desc.textContent = 'number of words you have guessed wrongly';
    wrong_guessed_words_wrapper.append(wrong_guessed_words_count, wrong_guessed_words_desc);

    const longest_streak_wrapper = this.createDivBlock('block_desc');
    const longest_streak_count = document.createElement('span');
    longest_streak_count.classList.add("block_desc_count");
    longest_streak_count.textContent = array ? String(array.longest_streak) : '0';
    const longest_streak_desc = document.createElement('p');
    longest_streak_desc.classList.add("block_desc_desc");
    longest_streak_desc.textContent = 'Your longest streak';
    longest_streak_wrapper.append(longest_streak_count, longest_streak_desc);

    short_stats_block.append(correct_guessed_words_wrapper, wrong_guessed_words_wrapper, longest_streak_wrapper);

    const header_sessions = document.createElement('h2');
    header_sessions.textContent = 'Times you played';
    const sessions_wrapper = this.createDivBlock('sessions');
    if (array) {
      for (const elem of array.progress_by_session) {
        const time = new Date(elem.date);
        const block = document.createElement("details");
        block.innerHTML = `Number of new words: <span>${elem.number_of_new_words}</span>`;
        const summary = document.createElement("summary");
        const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
        const date = time.getDate() < 10 ? `0${time.getDate()}` : `${time.getDate()}`;
        const month = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : `${time.getMonth() + 1}`;
        summary.textContent = `${time.getHours()}:${minutes} / ${date}.${
          month
        }.${time.getFullYear()}`;
        block.append(summary);
        sessions_wrapper.append(block);
      }
    } else {
      const description = document.createElement('p')
      description.textContent = "You haven't played this game yet";
      sessions_wrapper.append(description);
    }

    block.append(header, short_stats_block, header_sessions, sessions_wrapper);
    return block;
  }

  generateWordsStats(array: statisticsPerSession){
    const block = this.createDivBlock('words_block');
    const header = document.createElement('h2');
    header.textContent = 'Words statistics';
    block.append(header);
    if(!array){
      const description = document.createElement('p')
      description.textContent = "You haven't played any games yet";
      block.append(description);
      return block;
    }

    const sessions_wrapper = this.createDivBlock('sessions');
    for (const elem of array.statistics_per_session) {
      const time = new Date(elem.day);
      const block = document.createElement("details");
      const block_wrapper = this.createDivBlock("block_container")
      block_wrapper.innerHTML = `
      <div class="block_desc"><span class="block_desc_count">${elem.learned_words_per_session}</span>
        <p class="block_desc_desc">number of learned words</p>
      </div>
      <div class="block_desc"><span class="block_desc_count">${elem.new_words_per_session}</span>
        <p class="block_desc_desc">number of new words</p>
      </div>
      <div class="block_desc"><span class="block_desc_count">${Math.floor(elem.percentage_of_correct_answers_per_session)}%</span>
        <p class="block_desc_desc">Percantage of correct answers</p>
      </div>
      `;
      const summary = document.createElement("summary");
      const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
      const date = time.getDate() < 10 ? `0${time.getDate()}` : `${time.getDate()}`;
      const month = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : `${time.getMonth() + 1}`;
      summary.textContent = `${time.getHours()}:${minutes} / ${date}.${month}.${time.getFullYear()}`;
      block.append(summary);
      block.append(block_wrapper);
      sessions_wrapper.append(block);
    }
    const graph = new GraphNewWordsPerDay('div', 'graph-container', array)
    block.append(sessions_wrapper, graph.render());
    return block;
  }

  render() {
    //if user is anonymous
    const emptyDiv = createElement("div","empty-page");
    const loadingAnimation = new LoadingAnimation('div', 'loading-animation');
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
    this.container.append(emptyDiv,loadingAnimation.render())
    this.getStatistics().then(() => {
      if(typeof this.statistics === 'number'){
        const block = document.createElement('h2')
        block.textContent = 'Oops! Looks like you have not statistics';
        wrapper.classList.add('max-height')
        wrapper.append(block);
        emptyDiv.remove();
        loadingAnimation.stop();
        this.container.insertAdjacentElement("afterbegin", wrapper);
        return this.container;
      }
      const stats = this.statistics as statistics;
      const words_learned_wrapper = this.createDivBlock('block_desc');
      const words_learned_count = document.createElement('span');
      words_learned_count.classList.add("block_desc_count");
      words_learned_count.textContent = stats.learnedWords ? String(stats.learnedWords) : '0';
      const words_learned_desc = document.createElement('p');
      words_learned_desc.classList.add("block_desc_desc");
      words_learned_desc.textContent = 'number of words you have learned so far';
      words_learned_wrapper.append(words_learned_count, words_learned_desc);
      wrapper.append(header, words_learned_wrapper, this.generateGamestats('sprint', stats.optional.sprint!), this.generateGamestats('audio_call', stats.optional.audio_call!), this.generateWordsStats(stats.optional.words_statistics));
      emptyDiv.remove();
      loadingAnimation.stop();
      this.container.insertAdjacentElement("afterbegin", wrapper);
    })

    return this.container;
  }
}