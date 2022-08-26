import { createElement } from "../utils/utils";
import Controls from "./controls";


class HardWordsPageControls extends Controls{
  groupsClassName:string;
  groupClassName:string;
  constructor(tagName: string, className: string) {
    super(tagName, className);
    this.groupsClassName = "";
    this.groupClassName = "";
  }

  private renderGroups(className:string):HTMLElement{
    const classNameModifier = className.split("_")[className.split("_").length - 1];
    const div = createElement("div",`pagination__groups pagination__groups_${classNameModifier}`);
    for (let i = 0; i < 6; i++) {
      const divGroup = createElement("div",`pagination__groups-group pagination__groups-group_${classNameModifier}`);
      if (i == 0) divGroup.classList.add("js-clicked");
      divGroup.textContent = `Group ${i + 1}`;
      divGroup.setAttribute("data-group", `${i + 1}`);
      div.append(divGroup);
    }
    this.groupsClassName = `.pagination__groups.pagination__groups_${classNameModifier}`;
    this.groupClassName =`pagination__groups-group_${classNameModifier}`;
    return div;
  } 

  render(): HTMLElement {
    const classNameModifier = this.container.className.split("_")[1];
    this.container.append(this.renderGroups(`pagination__groups-group pagination__groups-group_${classNameModifier}`))
    return this.container;
  }
}

export default HardWordsPageControls;