import Component from "../templates/component";
import { createElement } from "../utils/utils";
import "./controls.scss";

export type PaginationButtons = {
  next: string;
  prev: string;
  last: string;
  first: string;
  page: string;
};

export type DropdownClasses ={
  div: string;
  content: string;
  group:string
}

class Controls extends Component {
  currentPage: number;
  pagButtons: PaginationButtons;
  dropdown:DropdownClasses;
  constructor(tagName: string, className: string) {
    super(tagName, className);
    this.currentPage = 1;
    this.pagButtons = {
      next: "",
      prev: "",
      last: "",
      first: "",
      page: "",
    };
    this.dropdown = {
      div:"",
      content:"",
      group:""
    }
  }
  renderDropdown(className: string): HTMLElement {
    const dropdown = createElement("div", `${className}`);
    const content = createElement("div", `${className}-content`);
    for (let i = 1; i < 6; i++) {
      const element = createElement("div", `${className}-group`);
      element.textContent = `Раздел ${i + 1}`;
      element.setAttribute("data-group", `${i + 1}`);
      content.append(element);
    }
    dropdown.textContent = "Раздел 1";
    dropdown.setAttribute("data-group", "1");
    dropdown.append(content);

    this.dropdown = {
      div: `${className}`,
      content: `${className}-content`,
      group: `${className}-group`
    }
    return dropdown;
  }
  render(): HTMLElement {
    const buttonNext = createElement(
      "button",
      "pagination__next"
    ) as HTMLButtonElement;
    const buttonPrev = createElement(
      "button",
      "pagination__prev"
    ) as HTMLButtonElement;
    const buttonFirst = createElement(
      "button",
      "pagination__first"
    ) as HTMLButtonElement;
    const buttonLast = createElement(
      "button",
      "pagination__last"
    ) as HTMLButtonElement;
    const div = createElement('div','pagination') as HTMLButtonElement;
    const page = createElement("span", "pagination__page") as HTMLSpanElement;

    buttonNext.textContent = ">";
    buttonPrev.textContent = "<";
    buttonFirst.textContent = "<<";
    buttonLast.textContent = ">>";
    page.textContent = "1";

    buttonPrev.disabled = true;
    buttonFirst.disabled = true;

    this.pagButtons.first = buttonFirst.className;
    this.pagButtons.last = buttonLast.className;
    this.pagButtons.next = buttonNext.className;
    this.pagButtons.prev = buttonPrev.className;
    this.pagButtons.page = page.className;
    div.append(
      buttonFirst,
      buttonPrev,
      page,
      buttonNext,
      buttonLast
    );
    this.container.append(div,this.renderDropdown("pagination__groups"));
    return this.container;
  }
}

export default Controls;
