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
    label.textContent = "Запомнить";

    div.append(checkbox, label);
    return div;
  }

  renderRegistrationLink(className: string): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const span = createElement("span", `${className}-span`);
    const spanLink = createElement("a", `${className}-link`) as HTMLLinkElement;

    span.textContent = "Ещё не зарегистрированы?";
    spanLink.innerText = "Регистрация";

    div.append(span, spanLink);

    return div;
  }

  render(): HTMLElement {
    const divLogin = createElement(
      "div",
      `${this.container.className}__container`
    );
    const form = createElement("form", `${this.container.className}__form`);
    const img = createElement(
      "img",
      `${this.container.className}__image`
    ) as HTMLImageElement;
    img.src = log_in_img;
    divLogin.append(
      this.renderCheckBox(
        `${this.container.className}__container`,
        "Запомни меня"
      ),
      this.renderButton(`${this.container.className}__button-log-in`, "Войти")
    );
    form.append(
      this.renderTitle(
        `${this.container.className}__title`,
        "RSLANG",
        "Добро пожаловать в RSLANG"
      ),
      this.renderField(
        `${this.container.className}__user`,
        "Имя пользователя",
        "Введите ваше имя"
      ),
      this.renderField(
        `${this.container.className}__password`,
        "Пароль",
        "Введите пароль",
        8,
        "password"
      ),
      divLogin,
      this.renderRegistrationLink(`${this.container.className}__registration`)
    );
    this.container.append(form, img);
    return this.container;
  }
}

export default LogIn;
