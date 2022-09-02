import Component from "../templates/component";
import { animation } from "./animation";
import "./loading-animation.scss";

class LoadingAnimation extends Component{
  type:string;
  constructor(tagName: string, className: string,type = "") {
    super(tagName,className);
    this.type = type;
  }

  stop(){
    this.container.remove();
    if (this.container.classList.contains("js-card")){
      this.container.classList.remove("js-card");
    }
  }

  render(): HTMLElement {
    if (this.type === "card") this.container.classList.add("js-card");
    this.container.innerHTML = animation;
    return this.container;
  }
}

export default LoadingAnimation;