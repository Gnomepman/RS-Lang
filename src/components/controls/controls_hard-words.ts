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

  render(): HTMLElement {
    this.container.append(this.renderDropdown("pagination__groups"));
    return this.container;
  }
}

export default HardWordsPageControls;