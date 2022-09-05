import Page from "../../components/templates/page";
import MainPage from "../main-page/main-page";
import StatisticsPage from "../statistics/statistics";
import HardWordsPage from "../hard-words/hard-words";
import Nav_menu from "../../components/nav-menu/nav-menu";
import Footer from "../../components/footer/footer";
import ErrorPage from "../error-page/error";
import LearningPage from "../learning/learning";
import Choose_game from "../choose-games/choose-game";
import {
  ErrorTypes,
  PageIds,
} from "../../components/types_and_enums/types_and_enums";
import AccessForm from "../../components/access-form/access-form";
import Sprint_game from "../sprint_game/sprint_game";
import Audio_game from "../audio_game/audio_game";
import favicon from '../../assets/logo.png';

export default class App {
  private static container: HTMLElement = document.body; //container where we append all other elements
  private static defaultPageId: string = "current-page";
  private nav_menu: Nav_menu;
  private static footer: Footer;
  private static modalWindow: AccessForm;

  //render new page depending on id
  static renderNewPage(idPage: string) {
    const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }

    let page: Page | null = null;

    //depending on page id, we pass a new container to the "page"
    switch (idPage) {
      case PageIds.MainPage:
        page = new MainPage(idPage);
        break;
      case PageIds.StatisticsPage:
        page = new StatisticsPage(idPage);
        break;
      case PageIds.LearningPage:
        page = new LearningPage(idPage);
        break;
      case PageIds.MiniGamesPage:
        page = new Choose_game(idPage);
        break;
      case PageIds.SprintGame:
        page = new Sprint_game(idPage);
        break;
      case PageIds.AudioGame:
        page = new Audio_game(idPage);
        break;
      case PageIds.HardWordsPage:
        page = new HardWordsPage(idPage);
        break;
      default:
        if (idPage.match(/sprint\/page\:/)) {
          console.log("Starting 'Sprint' game from textbook");
          page = new Sprint_game(
            idPage,
            Number(idPage.split("/")[2].split(":")[1]),
            Number(idPage.split("/")[1].split(":")[1])
          );
        } else if (idPage.match(/audio-challenge\/page\:/)) {
          console.log("Starting 'Audio-call' game from textbook");
          page = new Audio_game(
            idPage,
            Number(idPage.split("/")[2].split(":")[1]),
            Number(idPage.split("/")[1].split(":")[1])
          );
        } else {
          page = new ErrorPage(idPage, ErrorTypes.Error_404);
        }
        break;
    }

    //If page is not null - we render it
    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;

      if (!(page instanceof Sprint_game)) {
        //Also add < || !(page instanceof name_of_class_for_the_audio_game)>
        pageHTML.append(App.footer.render());
      }
      pageHTML.append(App.modalWindow.render());
      App.container.append(pageHTML);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setFavicons(favImg: 'string'){
    let headTitle = document.querySelector('head');
    let setFavicon = document.createElement('link');
    setFavicon.setAttribute('rel','shortcut icon');
    setFavicon.setAttribute('href', favImg);
    headTitle!.appendChild(setFavicon);
}

  //render page depending on hash in the link - {#bla-bla-bla}
  private enableRouteChange() {
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  //Init "nav-menu" with tag-name and class-name
  constructor() {
    App.modalWindow = new AccessForm("div", "modal-window-login");
    this.nav_menu = new Nav_menu("nav", "nav-container", App.modalWindow);
    App.footer = new Footer("footer", "footer-container");
  }

  //This method is called right when app starts.
  //What happens here?
  //To the <body> we append nav_menu and render page "main-page"
  run() {
    App.container.append(this.nav_menu.render());
    window.location.hash = "main-page";
    App.renderNewPage("main-page");
    this.nav_menu.showModal("modal-window-login", "#log_in", "log-in");
    this.nav_menu.showModal("modal-window-login", "#sign_up", "registration");
    this.nav_menu.logOut("auth-form__button_account");
    this.enableRouteChange();
    this.setFavicons(favicon);
  }
}
