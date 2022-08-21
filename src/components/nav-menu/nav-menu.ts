import './nav-menu.scss'
import Component from '../templates/component';
import { PageIds } from '../types_and_enums/types_and_enums';
import book from '../../assets/icon_book.svg'
import chart from '../../assets/icon_chart.svg'
import home from '../../assets/icon_home.svg'
import medal from '../../assets/icon_medal.svg'
import AccessForm from '../access-form/access-form';

export default class Nav_menu extends Component {
  //this.container = <nav class="nav-container">
  authForm: AccessForm;
  constructor(tagName: string, className: string, authForm: AccessForm) {
    super(tagName, className);
    this.authForm = authForm;
  }

  renderNavButtons() {
    let nav_buttons_wrapper = document.createElement('div');
    nav_buttons_wrapper.classList.add("nav-wrapper");
    Buttons.forEach((button) => {
      nav_buttons_wrapper.innerHTML += `
      <a href="#${button.id}" class="nav_button">
      <img src="${button.icon}">
      ${button.text}</a>
      `
    });
    this.container.append(nav_buttons_wrapper);
  }

  showModal(className:string,linkSelector:string,form:string){
    const modalWindow = document.querySelector(`.${className}`) as HTMLDivElement;
    const link = document.querySelector(linkSelector) as HTMLLinkElement;
    link.onclick = () => {
      this.authForm.renderForm(form);
      modalWindow.classList.add("js-show");}
  }

  render() {
    const login_form = document.createElement("div");
    login_form.classList.add("login_wrapper")
    login_form.innerHTML = `
        <button class="login_button" id="log_in">Log in</button>
        <button class="login_button" id="sign_up">Sign up</button>
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
    icon: home,
  },
  {
    id: PageIds.LearningPage,
    text: 'Textbook',
    icon: book,
  },
  {
    id: PageIds.MiniGamesPage,
    text: 'Minigames',
    icon: medal,
  },
  {
    id: PageIds.StatisticsPage,
    text: 'Statistics',
    icon: chart,
  },
];