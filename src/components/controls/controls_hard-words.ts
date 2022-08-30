import { createElement } from "../utils/utils";
import Controls from "./controls";


class HardWordsPageControls extends Controls{
  groupsClassName:string;
  groupClassName:string;
  constructor(tagName: string, className: string,initial:number) {
    super(tagName, className,initial);
    this.groupsClassName = "";
    this.groupClassName = "";
  }

  render(): HTMLElement {
    this.container.append(this.renderDropdown("pagination__groups",this.initial));
    return this.container;
  }
}

export default HardWordsPageControls;