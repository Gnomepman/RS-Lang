import Page from '../../components/templates/page';
import './choose-game.scss'
import sprint from '../../assets/sprint_temp.png'
import audio_call from '../../assets/audio_call_temp.png'

export default class Choose_game extends Page {
  
    constructor(id: string) {
      super(id);
    }
  
    render() {
      const choose_game_wrapper = this.createDivBlock('choose_game_wrapper');
      choose_game_wrapper.innerHTML = `
      <h2>Choose a game and practice words</h2>
      <div class="choose_games">
      <a href="#INSERT_HERE_NAME_OF_THE_GAME" class="game">
          <img src="${sprint}" alt="">
          <h3>Sprint</h3>
          <p>Teaches you how to quickly translate into your native language</p>
      </a>
      <a href="#INSERT_HERE_NAME_OF_THE_GAME" class="game">
          <img src="${audio_call}" alt="">
          <h3>Audio call</h3>
          <p>Improves listening comprehension</p>
      </a>
      </div>
      `

      this.container.append(choose_game_wrapper);
      return this.container;
    }
  }