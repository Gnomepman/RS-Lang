import Component from "../templates/component";
import { createElement } from "../utils/utils";
import log_in_img from "../../assets/log-in-img.svg";
import "./access-form.scss";

class AccessForm extends Component {
  constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  private renderTitle(
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

  private renderField(
    className: string,
    title: string,
    placeholder: string,
    minlength?: number,
    type = "text"
  ): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const classNameTemp = className.split(" ")[0];
    const classNameElem = className.split("_")[1];
    const labelTitle = createElement(
      "label",
      `${classNameTemp}__title ${classNameTemp}__title_${classNameElem}`
    ) as HTMLLabelElement;
    const input = createElement(
      "input",
      `${classNameTemp}__input ${classNameTemp}__input_${classNameElem}`
    ) as HTMLInputElement;

    labelTitle.textContent = title;
    input.placeholder = placeholder;

    input.type = type;
    if (minlength) input.setAttribute("minlength", minlength.toString(10));

    input.id = `${classNameElem}-input`;
    labelTitle.setAttribute("for", input.id);

    div.append(labelTitle, input);

    return div;
  }

  private renderButton(className: string, text: string): HTMLButtonElement {
    const button = createElement("button", className) as HTMLButtonElement;
    button.textContent = text;
    button.type = "submit";
    return button;
  }

  private renderCheckBox(className: string, text: string): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const classNameTempBlock = className.split(" ")[0];
    const classNameTempElem = className.split("_")[1];
    const checkbox = createElement(
      "input",
      `${classNameTempBlock}-checkbox ${classNameTempBlock}-checkbox_${classNameTempElem}`
    ) as HTMLInputElement;
    const label = createElement(
      "label",
      `${classNameTempBlock}-label ${classNameTempBlock}-label_${classNameTempElem}`
    ) as HTMLLabelElement;

    checkbox.type = "checkbox";
    label.textContent = text;

    div.append(checkbox, label);
    return div;
  }

  private renderLinkToForm(
    className: string,
    text1: string,
    text2: string
  ): HTMLDivElement {
    const div = createElement("div", className) as HTMLDivElement;
    const classNameTemp = className.split(" ")[0];
    const classNameElem = className.split("_")[1];
    const span = createElement(
      "span",
      `${classNameTemp}__span ${classNameTemp}__span_${classNameElem}`
    );
    const spanLink = createElement(
      "span",
      `${classNameTemp}__link ${classNameTemp}__link_${classNameElem}`
    ) as HTMLLinkElement;

    span.textContent = text1;
    spanLink.innerText = text2;

    spanLink.onclick = () => this.renderForm(classNameElem);

    div.append(span, spanLink);

    return div;
  }

  private renderLogInForm(className: string): HTMLDivElement {
    const divLogin = createElement("div", className) as HTMLDivElement;
    const classNameTempBlock = className.split(" ")[0];
    const classNameTempElem = className.split("_")[1];
    const divContainer = createElement(
      "div",
      `${classNameTempBlock}__container ${classNameTempBlock}__container_${classNameTempElem}`
    );
    const formLogIn = createElement(
      "form",
      `${classNameTempBlock}__form ${classNameTempBlock}__form_${classNameTempElem}`
    );
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
      this.renderButton(
        `${classNameTempBlock}__button ${classNameTempBlock}__button_log-in`,
        "Log In"
      )
    );
    formLogIn.append(
      this.renderTitle(
        `${classNameTempBlock}__title`,
        "RSLANG",
        "Welcome to RSLANG"
      ),
      this.renderField(`field field_user`, "Username", "Enter your name"),
      this.renderField(
        `field field_password`,
        "Password",
        "Enter password",
        8,
        "password"
      ),
      divContainer,
      this.renderLinkToForm(
        `link-to-form link-to-form_registration`,
        "Not registered yet?",
        "Sign Up"
      )
    );



    divLogin.append(formLogIn, img,this.renderCloseButton("button-close"));
    return divLogin;
  }

  private renderRegistrationForm(className: string) {
    const divLogin = createElement("div", className) as HTMLDivElement;
    const classNameTempBlock = className.split(" ")[0];
    const classNameTempElem = className.split("_")[1];

    const formLogIn = createElement(
      "form",
      `${classNameTempBlock}__form ${classNameTempBlock}__form_${classNameTempElem}`
    );
    const img = createElement(
      "img",
      `${classNameTempBlock}__image`
    ) as HTMLImageElement;

    img.src = log_in_img;

    formLogIn.append(
      this.renderTitle(
        `${classNameTempBlock}__title`,
        "RSLANG",
        "Welcome to RSLANG"
      ),
      this.renderField(`field field_user`, "Username", "Enter your name"),
      this.renderField(
        `field field_e-mail`,
        "E-Mail",
        "Enter your e-mail",
        undefined,
        "e-mail"
      ),
      this.renderField(
        `field field_password`,
        "Password",
        "Enter password",
        8,
        "password"
      ),
      this.renderButton(
        `${classNameTempBlock}__button ${classNameTempBlock}__button_${classNameTempElem}`,
        "Sign Up"
      ),
      this.renderLinkToForm(
        `link-to-form link-to-form_log-in`,
        "Already registered?",
        "Log In"
      )
    );
    divLogin.append(formLogIn, img,this.renderCloseButton("button-close"));
    return divLogin;
  }

  renderForm(form: string) {
    const classNameLogin = "log-in";
    const classNameRegistration = "registration";

    if (form === classNameLogin)
      this.container.replaceChildren(
        this.renderLogInForm(`auth-form auth-form_${classNameLogin}`)
      );
    if (form === classNameRegistration)
      this.container.replaceChildren(
        this.renderRegistrationForm(
          `auth-form auth-form_${classNameRegistration}`
        )
      );
  }

  private renderCloseButton(className:string):HTMLButtonElement{
    const button= createElement("button",className) as HTMLButtonElement;
    button.onclick = () => {
      if (this.container.classList.contains("js-show")) this.container.classList.remove("js-show");
    }

    return button;
  }

  render(): HTMLElement {
    return this.container;
  }
}

export default AccessForm;