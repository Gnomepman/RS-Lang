import './nav-menu.scss'
import Component from '../templates/component';
import burger_menu from '../../assets/burger-menu.svg' //need svg (loader connected and image exist, but does not work)
import { PageIds } from '../types_and_enums/types_and_enums';

export default class Nav_menu extends Component {
  //this.container = <nav class="nav-container">
  constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  renderNavButtons() {
    //TODO: add icons
    Buttons.forEach((button) => {
      const buttonHTML = document.createElement("a");
      buttonHTML.href = `#${button.id}`;
      buttonHTML.innerText = button.text;
      this.container.append(buttonHTML)
    });
  }

  render() {
    const burger: HTMLImageElement = document.createElement("img");
    burger.src = burger_menu;
    this.container.append(burger);
    const login_form = document.createElement("div");
    login_form.classList.add("login_wrapper")
    login_form.innerHTML = `
        <a href="#" class="login_button" id="log_in">Log in</a>
        <a href="#" class="login_button" id="sign_up">Sign up</a>
    `
    this.renderNavButtons();
    this.container.append(login_form);
    return this.container;
  }
}



//an array of navigation buttons
const Buttons = [
  {
    id: PageIds.MainPage,
    text: 'Main page',
  },
  {
    id: PageIds.LearningPage,
    text: 'Textbook',
  },
  {
    id: PageIds.MiniGamesPage,
    text: 'Minigames',
  },
  {
    id: PageIds.StatisticsPage,
    text: 'Statistics',
  },
];