import Component from '../templates/component';
import { createElement } from '../utils/utils';

class Pagination extends Component{
  currentPage: number;
  next:HTMLButtonElement | null;
  prev:HTMLButtonElement | null;
  last:HTMLButtonElement | null;
  first:HTMLButtonElement | null;
  page:HTMLSpanElement | null;
  constructor(tagName: string, className: string) {
    super(tagName, className);
    this.currentPage = 1;
    this.next = null;
    this.prev = null;
    this.last = null;
    this.first = null;
    this.page = null;

  }

  render(): HTMLElement {
      const buttonNext = createElement('button','pagination__next') as HTMLButtonElement;
      const buttonPrev = createElement('button','pagination__prev') as HTMLButtonElement;
      const buttonFirst = createElement('button','pagination__first') as HTMLButtonElement;
      const buttonLast = createElement('button','pagination__last') as HTMLButtonElement;
      const page = createElement('span', 'pagination__page') as HTMLSpanElement;
      
      buttonNext.textContent = '>';
      buttonPrev.textContent = '<';
      buttonFirst.textContent = '<<';
      buttonLast.textContent = '>>';
      page.textContent ='1';

      this.first = buttonFirst;
      this.last = buttonLast;
      this.next = buttonNext;
      this.prev = buttonPrev;
      this.page = page;
      this.container.append(buttonFirst,buttonPrev,page,buttonNext,buttonLast);
      return this.container;
  }
}


export default Pagination;