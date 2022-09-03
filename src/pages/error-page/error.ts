import Page from "../../components/templates/page";
import { ErrorTypes } from "../../components/types_and_enums/types_and_enums";
import ErrorImage from "../../assets/404-error.svg";
import "./error.scss";

export default class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    "404": "Error! The page was not found",
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  render() {
    const img = new Image();
    img.src = ErrorImage;
    img.id = "img-error";
    img.classList.add("error-image");

    const errorPage = document.createElement("div");
    errorPage.classList.add("error-container");

    const title = this.createHeaderTitle(ErrorPage.TextObject[this.errorType]);
    title.id = "desc-error";
    errorPage.append(img);
    errorPage.append(title);
    this.container.append(errorPage);

    return this.container;
  }
}
