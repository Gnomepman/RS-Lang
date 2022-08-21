import Component from "../templates/component";
import { createElement } from "../utils/utils";
import log_in_img from "../../assets/log-in-img.svg";
import "./log-in.scss";

class LogIn extends Component {
  constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  renderTitle(
    className: string,
    title: string,
    subtitle: string
  ): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const hTitle = createElement("h2", `${className}-title`);
    const spanSubtitle = createElement("span", `${className}-subtitle`);

    hTitle.textContent = title;
    spanSubtitle.textContent = subtitle;

    div.append(hTitle, spanSubtitle);

    return div;
  }

  renderField(
    className: string,
    title: string,
    placeholder: string,
    minlength?: number,
    type = "text"
  ): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const classNameTemp = className.split(" ")[0];
    const labelTitle = createElement(
      "label",
      `${classNameTemp}__title`
    ) as HTMLLabelElement;
    const input = createElement(
      "input",
      `${classNameTemp}__input`
    ) as HTMLInputElement;

    labelTitle.textContent = title;
    input.placeholder = placeholder;

    input.type = type;
    if (minlength) input.setAttribute("minlength", minlength.toString(10));

    input.id = `${classNameTemp}-input`;
    labelTitle.setAttribute("for", input.id);

    div.append(labelTitle, input);

    return div;
  }

  renderButton(className: string, text: string): HTMLButtonElement {
    const button = createElement("button", className) as HTMLButtonElement;
    button.textContent = text;
    button.type = "submit";
    return button;
  }

  renderCheckBox(className: string, text: string): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const classNameTempBlock = className.split(" ")[0];
    const classNameTempElem = className.split("_")[1];
    const checkbox = createElement(
      "input",
      `${classNameTempBlock}-checkbox ${classNameTempBlock}-checkbox_log-in`
    ) as HTMLInputElement;
    const label = createElement(
      "label",
      `${classNameTempBlock}-label ${classNameTempBlock}-label_log-in`
    ) as HTMLLabelElement;

    checkbox.type = "checkbox";
    label.textContent = text;

    div.append(checkbox, label);
    return div;
  }

  renderLinkToForm(className: string,text1:string,text2:string): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const classNameTemp = className.split(" ")[0];
    const span = createElement("span", `${classNameTemp}__span`);
    const spanLink = createElement("span", `${classNameTemp}__link`) as HTMLLinkElement;

    span.textContent = text1;
    spanLink.innerText = text2;

    div.append(span, spanLink);

    return div;
  }

  renderLogInForm(className:string):HTMLDivElement{
    const divLogin = createElement("div",className) as HTMLDivElement;
    const classNameTempBlock = className.split(" ")[0];
    const classNameTempElem = className.split("_")[1];
    const divContainer = createElement(
      "div",
      `${classNameTempBlock}__container ${classNameTempBlock}__container_${classNameTempElem}`
    );
    const formLogIn = createElement("form", `${classNameTempBlock}__form ${classNameTempBlock}__form_${classNameTempElem}`);
    const img = createElement(
      "img",
      `${classNameTempBlock}__image`
    ) as HTMLImageElement;

    img.src = log_in_img;
    divContainer.append(
      this.renderCheckBox(
        `${classNameTempBlock}__remember-me ${classNameTempBlock}__remember-me_${classNameTempElem}`,
        "Remember me"
      ),
      this.renderButton(`${classNameTempBlock}__button ${classNameTempBlock}__button_log-in`, "Log In")
    );
    formLogIn.append(
      this.renderTitle(
        `${classNameTempBlock}__title`,
        "RSLANG",
        "Welcome to RSLANG"
      ),
      this.renderField(
        `field field_user`,
        "Username",
        "Enter your name"
      ),
      this.renderField(
        `field field_password`,
        "Password",
        "Enter password",
        8,
        "password"
      ),
      divContainer,
      this.renderLinkToForm(`link-to-form link-to-form_registration`,"Not registered yet?","Register")
    );
    divLogin.append(formLogIn, img);
    return divLogin;
  }

  renderRegistrationForm(className:string){

  }
  

  render(): HTMLElement {
    const classNameLogin = "log-in";

    
    this.container.replaceChildren(this.renderLogInForm(`auth-form auth-form_${classNameLogin}`));
    return this.container;
  }
}

export default LogIn;
