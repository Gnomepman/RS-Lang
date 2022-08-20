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
    const labelTitle = createElement(
      "label",
      `${className}-title`
    ) as HTMLLabelElement;
    const id = className.split("__")[1];
    const input = createElement(
      "input",
      `${className}-input`
    ) as HTMLInputElement;

    labelTitle.textContent = title;
    input.placeholder = placeholder;

    input.type = type;
    if (minlength) input.setAttribute("minlength", minlength.toString(10));

    input.id = `${id}-input`;
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
    const checkbox = createElement(
      "input",
      `${className}-checkbox`
    ) as HTMLInputElement;
    const label = createElement(
      "label",
      `${className}-label`
    ) as HTMLLabelElement;

    checkbox.type = "checkbox";
    label.textContent = text;

    div.append(checkbox, label);
    return div;
  }

  renderRegistrationLink(className: string): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const span = createElement("span", `${className}-span`);
    const spanLink = createElement("span", `${className}-link`) as HTMLLinkElement;

    span.textContent = "Not registered yet?";
    spanLink.innerText = "Register";

    div.append(span, spanLink);

    return div;
  }

  render(): HTMLElement {
    const classNameLogin = "log-in";
    const divLogin = createElement("div",classNameLogin);
    const divContainer = createElement(
      "div",
      `${classNameLogin}__container`
    );
    const form = createElement("form", `${classNameLogin}__form`);
    const img = createElement(
      "img",
      `${classNameLogin}__image`
    ) as HTMLImageElement;

    img.src = log_in_img;
    divContainer.append(
      this.renderCheckBox(
        `${classNameLogin}__remember-me`,
        "Remember me"
      ),
      this.renderButton(`${classNameLogin}__button-log-in`, "Log In")
    );
    form.append(
      this.renderTitle(
        `${classNameLogin}__title`,
        "RSLANG",
        "Welcome to RSLANG"
      ),
      this.renderField(
        `${classNameLogin}__user`,
        "Username",
        "Enter your name"
      ),
      this.renderField(
        `${classNameLogin}__password`,
        "Password",
        "Enter password",
        8,
        "password"
      ),
      divContainer,
      this.renderRegistrationLink(`${classNameLogin}__registration`)
    );
    divLogin.append(form, img);
    this.container.append(divLogin);
    return this.container;
  }
}

export default LogIn;
