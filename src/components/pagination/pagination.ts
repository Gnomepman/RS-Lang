import Component from "../templates/component";
import { createElement } from "../utils/utils";
import "./pagination.scss";

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

class Pagination extends Component {
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

    // dropdown.addEventListener("click", (e) => {
    //   dropdown.classList.toggle("js-clicked");

    //   if (
    //     (e.target as HTMLDivElement).classList.contains(`${className}-group`)
    //   ) {
    //     const prevGroup = dropdown.innerText;
    //     const prevGroupId: number = +(dropdown.getAttribute(
    //       "data-group"
    //     ) as string);
    //     const clickedGroupId: string = (
    //       e.target as HTMLDivElement
    //     ).getAttribute("data-group") as string;
    //     const clickedGroup = (e.target as HTMLDivElement).textContent;
    //     const div = createElement("div", `${className}-group`);
    //     div.setAttribute("data-group", prevGroupId.toString(10));
    //     div.textContent = prevGroup;
    //     dropdown.childNodes[0].textContent = clickedGroup;
    //     dropdown.setAttribute("data-group", clickedGroupId);
    //     const groups = document.querySelectorAll(`.${className}-group`);
    //     if (prevGroupId === 1) content.insertAdjacentElement("afterbegin", div);
    //     else if (prevGroupId === 6)
    //       content.insertAdjacentElement("beforeend", div);
    //     else groups[prevGroupId - 1].insertAdjacentElement("beforebegin", div);
    //     (e.target as HTMLDivElement).remove();
    //   }
    // });
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
    this.container.append(
      buttonFirst,
      buttonPrev,
      page,
      buttonNext,
      buttonLast,
      this.renderDropdown("pagination__groups")
    );
    return this.container;
  }
}

export default Pagination;
