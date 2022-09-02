import './nav-menu.scss'
import Component from '../templates/component';
import { PageIds } from '../types_and_enums/types_and_enums';
import book from '../../assets/icon_book.svg'
import chart from '../../assets/icon_chart.svg'
import home from '../../assets/icon_home.svg'
import medal from '../../assets/icon_medal.svg'
import user from '../../assets/user_signin_icon.svg'
import hard_words from '../../assets/hard_words.svg'
import logout from '../../assets/logout.svg'
import AccessForm from '../access-form/access-form';
import { SignInResponse } from '../api/types';
import { createElement } from '../utils/utils';

export default class Nav_menu extends Component {
  //this.container = <nav class="nav-container">
  authForm: AccessForm;
  constructor(tagName: string, className: string, authForm: AccessForm) {
    super(tagName, className);
    this.authForm = authForm;
  }

  renderNavButtons() {
    let nav_buttons_wrapper = document.createElement('div');
    const pageHardWords = {
      id:PageIds.HardWordsPage,
      text:"Hard Words",
      icon:hard_words
    };
    const buttonBurger = createElement("button","button-burger");
    const span = createElement("span","span-line");
    buttonBurger.append(span);
    buttonBurger.onclick = ()=>{
      buttonBurger.classList.toggle("js-clicked");
      buttonBurger.parentElement?.classList.toggle("js-clicked");
    }
    nav_buttons_wrapper.classList.add("nav-wrapper");
    if (localStorage.getItem("user")) Buttons.push(pageHardWords);
    Buttons.forEach((button) => {
      nav_buttons_wrapper.innerHTML += `
      <a href="#${button.id}" class="nav_button">
      <img src="${button.icon}">
      <span class="nav_text">${button.text}</span></a>
      `
    });
    this.container.append(buttonBurger,nav_buttons_wrapper);
  }


  showModal(className:string,linkSelector:string,form:string){
    const modalWindow = document.querySelector(`.${className}`) as HTMLDivElement;
    const link = document.querySelector(linkSelector) as HTMLLinkElement;
    if (link){
      link.onclick = () => {
        this.authForm.renderForm(form);
        modalWindow.classList.add("js-show");
      }
    }
  }

  logOut(selectorButton:string){
    const button = document.querySelector(`.${selectorButton}`) as HTMLButtonElement;
    if (button){
      button.onclick = ()=> {
        localStorage.removeItem("user");
        location.reload();
      }
    }
  }

  render() {
    const login_form = document.createElement("div");
    login_form.classList.add("login_wrapper");
    document.body.onclick = (e)=>{
      const element = e.target as HTMLElement;
      if ((!element.classList.contains("nav-container"))&&(!element.classList.contains("button-burger"))){
        const nav = document.querySelector(".nav-container") as HTMLDivElement;
        const burger = document.querySelector(".button-burger") as HTMLButtonElement;
        if (nav.classList.contains("js-clicked")){
          nav.classList.remove("js-clicked");
          burger.classList.remove("js-clicked");
        }
      }
    }
    let signedInUser:SignInResponse;
    if (localStorage.getItem("user")) {
      signedInUser = JSON.parse(localStorage.getItem("user") as string);
      login_form.innerHTML = `
      <div class="account">
        <img class="account__image" src="${user}" alt="">
        <span class="account__message">${signedInUser.name}</span>
        <button class="auth-form__button auth-form__button_account">
          <img src="${logout}" />
        </button>
      </div>
      `;
    }else{
      login_form.innerHTML = `
          <button class="login_button" id="log_in">Log in</button>
          <button class="login_button" id="sign_up">Sign up</button>
    `}
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