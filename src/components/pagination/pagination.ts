import Component from '../templates/component';
import { createElement } from '../utils/utils';
import './pagination.scss';

export type PaginationButtons = {
  next:string;
  prev:string;
  last:string;
  first:string;
  page:string;
}

class Pagination extends Component{
  currentPage: number;
  pagButtons:PaginationButtons
  constructor(tagName: string, className: string) {
    super(tagName, className);
    this.currentPage = 1;
    this.pagButtons = {
      next:'',
      prev:'',
      last:'',
      first:'',
      page:''
    }

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

      buttonPrev.disabled = true;
      buttonFirst.disabled = true;

      this.pagButtons.first = buttonFirst.className;
      this.pagButtons.last = buttonLast.className;
      this.pagButtons.next = buttonNext.className;
      this.pagButtons.prev = buttonPrev.className;
      this.pagButtons.page = page.className;
      this.container.append(buttonFirst,buttonPrev,page,buttonNext,buttonLast);
      return this.container;
  }
}


export default Pagination;