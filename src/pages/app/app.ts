import Page from "../../components/templates/page";
import MainPage from "../main-page/main-page";
import StatisticsPage from "../statistics/statistics";
import Nav_menu from "../../components/nav-menu/nav-menu";
import Footer from "../../components/footer/footer";
import ErrorPage from "../error-page/error";
import LearningPage from "../learning/learning";
import { ErrorTypes, PageIds } from "../../components/types_and_enums/types_and_enums";
import LogIn from "../../components/log-in/log-in";

export default class App {
  private static container: HTMLElement = document.body; //container where we append all other elements
  private static defaultPageId: string = "current-page";
  private nav_menu: Nav_menu;
  private logInForm: LogIn;
  private static footer: Footer;

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
      default:
        page = new ErrorPage(idPage, ErrorTypes.Error_404);
        break;
    }

    //If page is not null - we render it
    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      //to the rendered page we append a <footer>. In future this has to be moved to switch above
      //because <footer> does not have to be added for mini-games
      pageHTML.append(App.footer.render());
      App.container.append(pageHTML);
    }
  }

  //render page depending on hash in the link - {#bla-bla-bla}
  private enableRouteChange() {
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1);
      console.log(hash);
      App.renderNewPage(hash);
    });
  }

  //Init "nav-menu" with tag-name and class-name
  constructor() {
    this.nav_menu = new Nav_menu("nav", "nav-container");
    this.logInForm = new LogIn('div','log-in');
    App.footer = new Footer("footer", "footer-container");
  }

  //This method is called right when app starts.
  //What happens here?
  //To the <body> we append nav_menu and render page "main-page"
  run() {
    App.container.append(this.nav_menu.render(),this.logInForm.render());
    window.location.hash = '';
    App.renderNewPage("main-page");
    this.enableRouteChange();
  }
}
