import Component from '../templates/component';
import { createElement } from '../utils/utils';
import log_in_img from '../../assets/log-in-img.svg';
import './access-form.scss';
import Api from '../api/api';
import { API_URL, User } from '../api/types';

class AccessForm extends Component {

  private renderTitle(
    className: string,
    title: string,
    subtitle: string,
  ): HTMLDivElement {
    const div = createElement('div', className) as HTMLDivElement;
    const hTitle = createElement('h2', `${className}-title`);
    const spanSubtitle = createElement('span', `${className}-subtitle`);

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
    type = 'text',
  ): HTMLDivElement {
    const div = createElement('div', className) as HTMLDivElement;
    const classNameTemp = className.split(' ')[0];
    const classNameElem = className.split('_')[1];
    const labelTitle = createElement(
      'label',
      `${classNameTemp}__title ${classNameTemp}__title_${classNameElem}`,
    ) as HTMLLabelElement;
    const input = createElement(
      'input',
      `${classNameTemp}__input ${classNameTemp}__input_${classNameElem}`,
    ) as HTMLInputElement;

    labelTitle.textContent = title;
    input.placeholder = placeholder;

    input.type = type;
    if (minlength) input.setAttribute('minlength', minlength.toString(10));

    input.name = `${classNameElem}`;
    input.id = `${classNameElem}-input`;
    labelTitle.setAttribute('for', input.id);
    if (classNameElem === 'email') {
      input.oninput = () => AccessForm.showError('error', '', 'field__input_email');
    }
    div.append(labelTitle, input);

    return div;
  }

  private renderButton(className: string, text: string): HTMLButtonElement {
    const button = createElement('button', className) as HTMLButtonElement;
    button.textContent = text;
    button.type = 'submit';
    return button;
  }

  private renderCheckBox(className: string, text: string): HTMLDivElement {
    const div = createElement('div', className) as HTMLDivElement;
    const classNameTempBlock = className.split(' ')[0];
    const classNameTempElem = className.split('_')[1];
    const checkbox = createElement(
      'input',
      `${classNameTempBlock}-checkbox ${classNameTempBlock}-checkbox_${classNameTempElem}`,
    ) as HTMLInputElement;
    const label = createElement(
      'label',
      `${classNameTempBlock}-label ${classNameTempBlock}-label_${classNameTempElem}`,
    ) as HTMLLabelElement;

    checkbox.type = 'checkbox';
    label.textContent = text;

    div.append(checkbox, label);
    return div;
  }

  private renderLinkToForm(
    className: string,
    text1: string,
    text2: string,
  ): HTMLDivElement {
    const div = createElement('div', className) as HTMLDivElement;
    const classNameTemp = className.split(' ')[0];
    const classNameElem = className.split('_')[1];
    const span = createElement(
      'span',
      `${classNameTemp}__span ${classNameTemp}__span_${classNameElem}`,
    );
    const spanLink = createElement(
      'span',
      `${classNameTemp}__link ${classNameTemp}__link_${classNameElem}`,
    ) as HTMLLinkElement;

    span.textContent = text1;
    spanLink.innerText = text2;

    spanLink.onclick = () => this.renderForm(classNameElem);

    div.append(span, spanLink);

    return div;
  }

  // render form for Log In
  private renderLogInForm(className: string): HTMLDivElement {
    const divLogin = createElement('div', className) as HTMLDivElement;
    const classNameTempBlock = className.split(' ')[0];
    const classNameTempElem = className.split('_')[1];
    const divData = createElement(
      'div',
      `${classNameTempBlock}__wrapper ${classNameTempBlock}__wrapper_${classNameTempElem}`,
    ) as HTMLDivElement;
    const divContainer = createElement(
      'div',
      `${classNameTempBlock}__container ${classNameTempBlock}__container_${classNameTempElem}`,
    );
    const formLogIn = createElement(
      'form',
      `${classNameTempBlock}__form ${classNameTempBlock}__form_${classNameTempElem}`,
    );
    const img = createElement(
      'img',
      `${classNameTempBlock}__image`,
    ) as HTMLImageElement;

    img.src = log_in_img;
    divContainer.append(
      this.renderCheckBox(
        `${classNameTempBlock}__remember-me ${classNameTempBlock}__remember-me_${classNameTempElem}`,
        'Remember me',
      ),
      this.renderButton(
        `${classNameTempBlock}__button ${classNameTempBlock}__button_log-in`,
        'Log In',
      ),
    );
    formLogIn.append(
      this.renderField(
        'field field_email',
        'E-mail',
        'Enter your e-mail',
        undefined,
        'email',
      ),
      this.renderField(
        'field field_password',
        'Password',
        'Enter password',
        8,
        'password',
      ),
      this.renderSpanError('error'),
      divContainer,
    );
    divData.append(
      this.renderTitle(
        `${classNameTempBlock}__title`,
        'RSLANG',
        'Welcome to RSLANG',
      ),
      formLogIn,
      this.renderLinkToForm(
        'link-to-form link-to-form_registration',
        'Not registered yet?',
        'Sign Up',
      ),
    );
    formLogIn.setAttribute('method', 'POST');
    // listener for Log In method
    formLogIn.addEventListener('submit', this.logIn);
    divLogin.append(divData, img, this.renderCloseButton('button-close'));
    return divLogin;
  }

  // render error message for errors in e-mail or password
  private renderSpanError(className: string): HTMLSpanElement {
    const span = createElement('span', className) as HTMLSpanElement;
    return span;
  }

  // show error with text or hide message with blank text
  static showError(spanSelector: string, text: string, inputError?: string) {
    const span = document.querySelector(`.${spanSelector}`) as HTMLSpanElement;
    const input = document.querySelector(`.${inputError}`) as HTMLInputElement;
    if (text) {
      span.textContent = text;
      span.classList.add('js-error');
      input.classList.add('js-error');
    } else if (span.classList.contains('js-error')) {
      span.classList.remove('js-error');
      input.classList.remove('js-error');
    }
  }

  // render registration form
  private renderRegistrationForm(className: string) {
    const divLogin = createElement('div', className) as HTMLDivElement;
    const classNameTempBlock = className.split(' ')[0];
    const classNameTempElem = className.split('_')[1];
    const divData = createElement(
      'div',
      `${classNameTempBlock}__wrapper ${classNameTempBlock}__wrapper_${classNameTempElem}`,
    ) as HTMLDivElement;
    const formRegistration = createElement(
      'form',
      `${classNameTempBlock}__form ${classNameTempBlock}__form_${classNameTempElem}`,
    );
    const img = createElement(
      'img',
      `${classNameTempBlock}__image`,
    ) as HTMLImageElement;

    img.src = log_in_img;

    formRegistration.append(
      this.renderField('field field_name', 'Username', 'Enter your name'),
      this.renderField(
        'field field_email',
        'E-Mail',
        'Enter your e-mail',
        undefined,
        'email',
      ),
      this.renderField(
        'field field_password',
        'Password',
        'Enter password',
        8,
        'password',
      ),
      this.renderSpanError('error'),
      this.renderButton(
        `${classNameTempBlock}__button ${classNameTempBlock}__button_${classNameTempElem}`,
        'Sign Up',
      ),
    );
    divData.append(
      this.renderTitle(
        `${classNameTempBlock}__title`,
        'RSLANG',
        'Welcome to RSLANG',
      ),
      formRegistration,
      this.renderLinkToForm(
        'link-to-form link-to-form_log-in',
        'Already registered?',
        'Log In',
      ),
    );
    // listener for sign Up method
    formRegistration.addEventListener('submit', this.signUp);
    divLogin.append(divData, img, this.renderCloseButton('button-close'));
    return divLogin;
  }

  // sign Up, create user, if wrong email or password - show error message
  async signUp(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const dataFromForm = new FormData(form);
    const dataObj: User = Object.fromEntries(dataFromForm) as User;
    const api = new Api(API_URL);
    try {
      const response = await api.createUser(dataObj);
      // if user with this email exist
      if (response === 417) {
        AccessForm.showError(
          'error',
          'User with this email already exist',
          'field__input_email',
        );
      }
      // if incorrect password
      if (response === 422) {
        AccessForm.showError(
          'error',
          'Incorrect e-mail or password',
          'field__input_email',
        );
      }
      // if creating user successful - reload page
      if (typeof response === 'object') location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  // log in, show error - if e-mail donn't exist
  async logIn(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const dataFromForm = new FormData(form);
    const dataObj: User = Object.fromEntries(dataFromForm) as User;
    const api = new Api(API_URL);
    try {
      const response = await api.signIn(dataObj);
      if (typeof response === 'object') {
        // save creation time for token
        const currentTime = Date.now();
        response.created = currentTime.toString(10);
        const objToString = JSON.stringify(response);
        localStorage.setItem('user', objToString);
        location.reload();
      }
      if (response === 404) {
        AccessForm.showError(
          'error',
          "User with this email doesn't exist",
          'field__input_email',
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  renderForm(form: string) {
    const classNameLogin = 'log-in';
    const classNameRegistration = 'registration';

    if (form === classNameLogin) {
      this.container.replaceChildren(
        this.renderLogInForm(`auth-form auth-form_${classNameLogin}`),
      );
    }
    if (form === classNameRegistration) {
      this.container.replaceChildren(
        this.renderRegistrationForm(
          `auth-form auth-form_${classNameRegistration}`,
        ),
      );
    }
  }

  private renderCloseButton(className: string): HTMLButtonElement {
    const button = createElement('button', className) as HTMLButtonElement;
    button.onclick = () => {
      if (this.container.classList.contains('js-show')) { this.container.classList.remove('js-show'); }
    };

    return button;
  }

  render(): HTMLElement {
    return this.container;
  }
}

export default AccessForm;
