import Page from '../../components/templates/page';
import Api from '../../components/api/api';
import './learning.scss';
import WordCard from '../../components/word-card/word-card';
import Controls, {
  PaginationButtons,
  DropdownClasses,
} from '../../components/controls/controls';
import {
  AggregatedWord,
  AggregatedWords,
  API_URL,
  SignInResponse,
  WordAttributes,
} from '../../components/api/types';
import {
  createElement,
  getGroupFromSessionStorage,
  getPageFromSessionStorage,
  saveGroupToSessionStorage,
  savePageToSessionStorage,
} from '../../components/utils/utils';
import sprint_icon from '../../assets/sprint.png';
import audio_challenge_icon from '../../assets/audio_call.png';
import LoadingAnimation from '../../components/loading-animation/loading-animation';

class LearningPage extends Page {
  static TextObject = {
    MainTitle: 'Learning2 Page',
  };

  static currentGroup = 1;

  static currentPage = 1;

  static divWrapper: HTMLDivElement;

  static wrapperClass: string;

  static emptyDiv: HTMLDivElement;

  constructor(id: string) {
    super(id);
    LearningPage.wrapperClass = 'learning__wrapper';
    LearningPage.divWrapper = createElement(
      'div',
      LearningPage.wrapperClass,
    ) as HTMLDivElement;
    LearningPage.divWrapper.setAttribute('data-page-group', '1');
    LearningPage.emptyDiv = createElement(
      'div',
      'empty-container',
    ) as HTMLDivElement;
  }

  dropdownAction(
    event: MouseEvent,
    dropdown: DropdownClasses,
  ): string | undefined {
    const content = document.querySelector(
      `.${dropdown.content}`,
    ) as HTMLDivElement;
    const element = event.currentTarget as HTMLDivElement;
    const group = event.target as HTMLDivElement;
    element.classList.toggle('js-clicked');
    if (group.classList.contains(dropdown.group)) {
      const prevGroup = element.childNodes[0].textContent;
      const prevGroupId: number = +(element.getAttribute(
        'data-group',
      ) as string);
      const clickedGroupId: string = group.getAttribute('data-group') as string;
      const clickedGroup = group.textContent;
      const newGroup = createElement('div', dropdown.group);
      newGroup.setAttribute('data-group', prevGroupId.toString(10));
      newGroup.textContent = prevGroup;
      element.childNodes[0].textContent = clickedGroup;
      element.setAttribute('data-group', clickedGroupId);
      const groups = document.querySelectorAll(
        `.${dropdown.group}`,
      ) as NodeListOf<HTMLDivElement>;
      if (prevGroupId === 1) {
        content.insertAdjacentElement('afterbegin', newGroup);
      } else if (prevGroupId === 6) {
        content.insertAdjacentElement('beforeend', newGroup);
      } else {
        groups[prevGroupId - 1].insertAdjacentElement('beforebegin', newGroup);
      }
      group.remove();
      return clickedGroupId;
    }
    return undefined;
  }

  async renderNewGroup(
    dropdown: DropdownClasses,
    pagButtons: PaginationButtons,
  ) {
    const div = document.querySelector(`.${dropdown.div}`) as HTMLDivElement;
    div.addEventListener('click', async (e) => {
      const clickedGroup = this.dropdownAction(e, dropdown);
      const mainDiv = document.querySelector(
        `.${LearningPage.wrapperClass}`,
      ) as HTMLDivElement;
      if (clickedGroup) {
        LearningPage.currentGroup = +(clickedGroup as string);
        saveGroupToSessionStorage(LearningPage.currentGroup);
        mainDiv.setAttribute('data-page-group', clickedGroup);
        await this.renderCardWords(1, LearningPage.currentGroup);
        LearningPage.resetPagination(pagButtons);
      }
    });
  }

  static isAdded(
    words: AggregatedWord[],
    wordId: string,
  ): AggregatedWord | undefined {
    const result = words.find((i) => i._id === wordId);
    return result;
  }

  // Render words from needed page and group
  async renderCardWords(page: number, group: number) {
    const api = new Api(`${API_URL}`);
    const loadingAnimation = new LoadingAnimation('div', 'loading-animation');
    LearningPage.divWrapper.parentElement?.append(loadingAnimation.render());
    const words = await api.getWords(page, group);
    let user: SignInResponse;
    let hardWords: AggregatedWords[] | number;
    let learnedWords: AggregatedWords[] | number;
    let userWords: AggregatedWord[];
    let wordCount = 0;
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user') as string);
      hardWords = await api.getAggregatedWords(page, group, 'hard', false);
      learnedWords = await api.getAggregatedWords(page, group, 'easy', null);
      if (Array.isArray(hardWords) && Array.isArray(learnedWords)) {
        userWords = [
          ...hardWords[0].paginatedResults,
          ...learnedWords[0].paginatedResults,
        ];
        const hardWordsCount = hardWords[0].totalCount[0]?.count
          ? hardWords[0].totalCount[0]?.count
          : 0;
        const learnedWordsCount = learnedWords[0].totalCount[0]?.count
          ? learnedWords[0].totalCount[0]?.count
          : 0;
        wordCount = hardWordsCount + learnedWordsCount;
      }

    }

    const div = document.createElement('div');
    const current = document.querySelector('.learning') as HTMLDivElement;
    let wordCard: WordCard;
    if (current) current.remove();
    div.className = 'learning';
    // if all words had been learned or added to hard
    if (wordCount === 20) LearningPage.divWrapper.classList.add('js-done');
    // if page already has class "js-done"
    else if (LearningPage.divWrapper.classList.contains('js-done')) {
      LearningPage.divWrapper.classList.remove('js-done');
    }
    words.forEach((word) => {
      // if user added to hard words or learned
      if (userWords && Array.isArray(userWords)) {
        const difficulty = LearningPage.isAdded(userWords, word.id);
        // if word had been added to hard words or learned
        if (difficulty) {
          // if difficulty of word is hard
          if (difficulty?.userWord?.difficulty === 'hard') {
            wordCard = new WordCard(
              'div',
              'learning__word-card',
              word,
              'js-added',
              '',
              false,
              difficulty?.userWord?.optional?.progress
            );
          }
          // if difficulty of word is "learned"
          else if (
            difficulty?.userWord?.difficulty === 'easy'
            && difficulty?.userWord?.optional?.learned === true
          ) {
            wordCard = new WordCard(
              'div',
              'learning__word-card',
              word,
              '',
              'js-learned',
              true,
              difficulty?.userWord?.optional?.progress
            );
            // if word is easy, but learned is "false"
          } else {
            wordCard = new WordCard('div', 'learning__word-card', word, '', '',true,difficulty?.userWord?.optional?.progress);
          }
        } else {
          wordCard = new WordCard('div', 'learning__word-card', word, '', '',false,0);
        }
      } else {
        wordCard = new WordCard('div', 'learning__word-card', word, '', '',false,0);
      }
      div.append(wordCard.render());
    });
    LearningPage.divWrapper.insertAdjacentElement('afterbegin', div);
    loadingAnimation.stop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render next page after click on button next page
  async renderNextPage(pagButtons: PaginationButtons) {
    const buttonNext = document.querySelector(
      `.${pagButtons.next}`,
    ) as HTMLButtonElement;
    buttonNext?.addEventListener('click', async () => {
      const spanPage = document.querySelector(
        `.${pagButtons.page}`,
      ) as HTMLSpanElement;
      const buttonPrev = document.querySelector(
        `.${pagButtons.prev}`,
      ) as HTMLButtonElement;
      const buttonFirst = document.querySelector(
        `.${pagButtons.first}`,
      ) as HTMLButtonElement;
      const buttonLast = document.querySelector(
        `.${pagButtons.last}`,
      ) as HTMLButtonElement;
      // get current page
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent += 1;
      LearningPage.currentPage = pageCurrent;
      savePageToSessionStorage(LearningPage.currentPage);
      // if current page 30 - disable buttons next and last
      if (pageCurrent === 30) {
        buttonNext.disabled = true;
        buttonLast.disabled = true;
      }
      // if prev button disabled - enable
      if (buttonPrev.disabled) {
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      // remove div with class .learning and append new div with new words
      await this.renderCardWords(pageCurrent, LearningPage.currentGroup);
      spanPage.textContent = pageCurrent.toString(10);
    });
  }

  // Render previous page after click on button prev page
  async renderPrevPage(pagButtons: PaginationButtons) {
    const buttonPrev = document.querySelector(
      `.${pagButtons.prev}`,
    ) as HTMLButtonElement;
    buttonPrev.addEventListener('click', async () => {
      const buttonNext = document.querySelector(
        `.${pagButtons.next}`,
      ) as HTMLButtonElement;
      const buttonFirst = document.querySelector(
        `.${pagButtons.first}`,
      ) as HTMLButtonElement;
      const buttonLast = document.querySelector(
        `.${pagButtons.last}`,
      ) as HTMLButtonElement;
      const spanPage = document.querySelector(
        `.${pagButtons.page}`,
      ) as HTMLSpanElement;
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent -= 1;
      LearningPage.currentPage = pageCurrent;
      savePageToSessionStorage(LearningPage.currentPage);
      // if current page 1 - disable buttons prev and first
      if (pageCurrent === 1) {
        buttonPrev.disabled = true;
        buttonFirst.disabled = true;
      }
      // if next button disabled - enable
      if (buttonNext.disabled) {
        buttonNext.disabled = false;
        buttonLast.disabled = false;
      }
      // remove div with class .learning and append new div with new words
      await this.renderCardWords(pageCurrent, LearningPage.currentGroup);
      spanPage.textContent = pageCurrent.toString(10);
    });
  }

  async renderLastPage(pagButtons: PaginationButtons) {
    const buttonLast = document.querySelector(
      `.${pagButtons.last}`,
    ) as HTMLButtonElement;
    const buttonNext = document.querySelector(
      `.${pagButtons.next}`,
    ) as HTMLButtonElement;
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`,
    ) as HTMLButtonElement;
    const buttonPrev = document.querySelector(
      `.${pagButtons.prev}`,
    ) as HTMLButtonElement;
    buttonLast.addEventListener('click', async () => {
      const spanPage = document.querySelector(
        `.${pagButtons.page}`,
      ) as HTMLSpanElement;
      LearningPage.currentPage = 30;
      savePageToSessionStorage(LearningPage.currentPage);
      spanPage.textContent = '30';
      buttonLast.disabled = true;
      buttonNext.disabled = true;
      if (buttonPrev.disabled) {
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      await this.renderCardWords(30, LearningPage.currentGroup);
    });
  }

  async renderFirstPage(pagButtons: PaginationButtons) {
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`,
    ) as HTMLButtonElement;
    buttonFirst.addEventListener('click', async () => {
      const buttonNext = document.querySelector(
        `.${pagButtons.next}`,
      ) as HTMLButtonElement;
      const buttonPrev = document.querySelector(
        `.${pagButtons.prev}`,
      ) as HTMLButtonElement;
      const buttonLast = document.querySelector(
        `.${pagButtons.last}`,
      ) as HTMLButtonElement;
      const spanPage = document.querySelector(
        `.${pagButtons.page}`,
      ) as HTMLSpanElement;
      spanPage.textContent = '1';
      LearningPage.currentPage = 1;
      savePageToSessionStorage(LearningPage.currentPage);
      buttonPrev.disabled = true;
      buttonFirst.disabled = true;
      if (buttonNext.disabled) {
        buttonNext.disabled = false;
        buttonLast.disabled = false;
      }
      await this.renderCardWords(1, LearningPage.currentGroup);
    });
  }

  // render dropdown for minigame's links
  private renderMiniGamesDropdown(className: string) {
    const content = createElement('div', `${className}-content`);
    const linkSprint = createElement(
      'a',
      `${className}-sprint-link`,
    ) as HTMLLinkElement;
    const linkAudioChallenge = createElement(
      'a',
      `${className}-audio-challenge-link`,
    ) as HTMLLinkElement;
    const miniGameSprint = createElement(
      'img',
      `${className}-sprint-image`,
    ) as HTMLImageElement;
    const miniGameAudioChallenge = createElement(
      'img',
      `${className}-audio-challenge-image`,
    ) as HTMLImageElement;
    const spanSprint = createElement("span",`${className}-sprint-title`);
    const spanAudioCall = createElement("span",`${className}-audio-call-title`);
    const divSprint = createElement('div',`${className}-sprint-wrapper`);
    const divAudioCall = createElement('div',`${className}-audio-call-wrapper`);
    const icon = document.querySelector(`.${className}`) as HTMLDivElement;
    const pSprint = createElement('div',`${className}-sprint-description`);
    const pAudioCall = createElement('div',`${className}-audio-call-description`);
    const divSprintText = createElement('div',`${className}-sprint-text`);
    const divAudioCallText = createElement('div',`${className}-audio-call-text`);

    linkSprint.href = 'index.html#sprint';
    linkAudioChallenge.href = 'index.html#audio-challenge';
    miniGameSprint.src = sprint_icon;
    miniGameAudioChallenge.src = audio_challenge_icon;
    spanSprint.textContent = 'Sprint';
    pSprint.textContent = 'Teaches you how to quickly translate into your native language';
    spanAudioCall.textContent = 'Audio Call';
    pAudioCall.textContent = 'Improves listening comprehension';
    divSprintText.append(spanSprint,pSprint);
    divAudioCallText.append(spanAudioCall,pAudioCall);
    divSprint.append(miniGameSprint,divSprintText);
    divAudioCall.append(miniGameAudioChallenge,divAudioCallText);
    linkSprint.append(divSprint);
    linkAudioChallenge.append(divAudioCall);
    content.append(linkAudioChallenge, linkSprint);
    icon.append(content);
    // listener for event click
    icon.addEventListener('click', () => {
      icon.classList.toggle('js-clicked');
      // add links to div
      const linkToAudioChallenge = icon.lastChild
        ?.firstChild as HTMLLinkElement;
      const linkToSprint = icon.lastChild?.lastChild as HTMLLinkElement;
      // form href attribute for link
      linkToAudioChallenge.href = `#audio-challenge/page:${LearningPage.currentPage}/group:${LearningPage.currentGroup}`;
      linkToSprint.href = `#sprint/page:${LearningPage.currentPage}/group:${LearningPage.currentGroup}`;
    });
  }
  // reset pagination to it's initial state
  static resetPagination(pagButtons: PaginationButtons) {
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`,
    ) as HTMLButtonElement;
    const buttonNext = document.querySelector(
      `.${pagButtons.next}`,
    ) as HTMLButtonElement;
    const buttonPrev = document.querySelector(
      `.${pagButtons.prev}`,
    ) as HTMLButtonElement;
    const buttonLast = document.querySelector(
      `.${pagButtons.last}`,
    ) as HTMLButtonElement;
    const spanPage = document.querySelector(
      `.${pagButtons.page}`,
    ) as HTMLSpanElement;

    spanPage.textContent = '1';
    if (buttonNext.disabled) {
      buttonNext.disabled = false;
      buttonLast.disabled = false;
    }
    if (!buttonPrev.disabled) {
      buttonPrev.disabled = true;
      buttonFirst.disabled = true;
    }
  }

  render() {

    if (getGroupFromSessionStorage()) {
      LearningPage.currentGroup = +(getGroupFromSessionStorage() as string);
      LearningPage.divWrapper.setAttribute("data-page-group",LearningPage.currentGroup.toString(10));
    }
    const controls = new Controls('div', 'controls', LearningPage.currentGroup);
    const controlsElement = controls.render();
    if (getPageFromSessionStorage()) {
      LearningPage.currentPage = +(getPageFromSessionStorage() as string);
    }
    const loadingAnimation = new LoadingAnimation('div', 'loading-animation');
    this.container.append(loadingAnimation.render(), LearningPage.emptyDiv);
    this.renderCardWords(
      LearningPage.currentPage,
      LearningPage.currentGroup,
    ).then(() => {
      LearningPage.emptyDiv.remove();
      loadingAnimation.stop();
      LearningPage.divWrapper.append(controlsElement);
      this.container.insertAdjacentElement(
        'afterbegin',
        LearningPage.divWrapper,
      );
      this.renderNextPage(controls.pagButtons);
      this.renderPrevPage(controls.pagButtons);
      this.renderLastPage(controls.pagButtons);
      this.renderFirstPage(controls.pagButtons);
      this.renderNewGroup(controls.dropdown, controls.pagButtons);
      this.renderMiniGamesDropdown(controls.miniGamesClass);
    });
    return this.container;
  }
}

export default LearningPage;
