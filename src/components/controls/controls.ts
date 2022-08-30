import Component from '../templates/component';
import { createElement, getPageFromSessionStorage } from '../utils/utils';
import home_icon from '../../assets/home.svg';
import miniGames_icon from '../../assets/mini-games.svg';
import './controls.scss';

export type PaginationButtons = {
  next: string;
  prev: string;
  last: string;
  first: string;
  page: string;
};

export type DropdownClasses = {
  div: string;
  content: string;
  group: string;
};

class Controls extends Component {
  currentPage: number;

  pagButtons: PaginationButtons;

  dropdown: DropdownClasses;

  miniGamesClass: string;

  initial:number;

  private controlsWrapper: HTMLDivElement;

  constructor(tagName: string, className: string, initial:number) {
    super(tagName, className);
    this.currentPage = 1;
    this.pagButtons = {
      next: '',
      prev: '',
      last: '',
      first: '',
      page: '',
    };
    this.dropdown = {
      div: '',
      content: '',
      group: '',
    };
    this.miniGamesClass = '';
    this.controlsWrapper = createElement(
      'div',
      'controls-wrapper',
    ) as HTMLDivElement;
    this.initial = initial;
  }

  renderDropdown(className: string, initial:number): HTMLElement {
    const dropdown = createElement('div', `${className}`);
    const content = createElement('div', `${className}-content`);
    for (let i = 1; i < 7; i += 1) {
      const element = createElement('div', `${className}-group`);
      if (i === initial) {
        dropdown.textContent = `Group ${i}`;
        dropdown.setAttribute('data-group', `${i}`);
      } else {
        element.textContent = `Group ${i}`;
        element.setAttribute('data-group', `${i}`);
        content.append(element);
      }
    }

    dropdown.setAttribute('data-group', `${initial}`);
    dropdown.append(content);

    this.dropdown = {
      div: `${className}`,
      content: `${className}-content`,
      group: `${className}-group`,
    };
    return dropdown;
  }

  renderPagination(className: string): HTMLDivElement {
    const div = createElement('div', className) as HTMLDivElement;
    const buttonNext = createElement(
      'button',
      `${className}__next`,
    ) as HTMLButtonElement;
    const buttonPrev = createElement(
      'button',
      `${className}__prev`,
    ) as HTMLButtonElement;
    const buttonFirst = createElement(
      'button',
      `${className}__first`,
    ) as HTMLButtonElement;
    const buttonLast = createElement(
      'button',
      `${className}__last`,
    ) as HTMLButtonElement;
    const page = createElement('span', `${className}__page`) as HTMLSpanElement;

    buttonNext.innerHTML = '&#5125;';
    buttonPrev.innerHTML = '&#5130;';
    buttonFirst.innerHTML = '&#5130;&#5130;';
    buttonLast.innerHTML = '&#5125;&#5125;';
    if (getPageFromSessionStorage()) page.textContent = getPageFromSessionStorage();
    else page.textContent = '1';

    const currentPage = +(page.textContent as string);

    if (currentPage === 1) {
      buttonPrev.disabled = true;
      buttonFirst.disabled = true;
    }

    if (currentPage === 30) {
      buttonNext.disabled = true;
      buttonLast.disabled = true;
    }

    this.pagButtons.first = buttonFirst.className;
    this.pagButtons.last = buttonLast.className;
    this.pagButtons.next = buttonNext.className;
    this.pagButtons.prev = buttonPrev.className;
    this.pagButtons.page = page.className;
    div.append(buttonFirst, buttonPrev, page, buttonNext, buttonLast);
    return div;
  }

  renderIcon(className: string, path: string) {
    const div = createElement('div', className) as HTMLDivElement;
    const icon = createElement('img', `${className}-image`) as HTMLImageElement;
    icon.src = path;
    div.append(icon);
    return div;
  }

  renderHomeLink(className: string, path: string) {
    const a = createElement('a', className) as HTMLLinkElement;
    const icon = createElement('img', `${className}-image`) as HTMLImageElement;
    icon.src = path;
    a.href = 'index.html#main-page';
    a.append(icon);
    return a;
  }

  render(): HTMLElement {
    this.miniGamesClass = 'controls__mini-games';
    this.controlsWrapper.append(
      this.renderHomeLink('controls__home', home_icon),
      this.renderIcon(this.miniGamesClass, miniGames_icon),
      this.renderDropdown('pagination__groups', this.initial),
    );
    this.container.append(
      this.controlsWrapper,
      this.renderPagination('pagination'),
    );
    return this.container;
  }
}

export default Controls;
