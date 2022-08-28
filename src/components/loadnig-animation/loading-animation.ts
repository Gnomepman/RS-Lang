import Component from "../templates/component";
import { animation } from "./animation";
import "./loading-animation.scss";

class LoadingAnimation extends Component{
  divClass:string;
  type:string;
  constructor(tagName: string, className: string,divClass:string,type = "") {
    super(tagName,className);
    this.divClass = divClass;
    this.type = type;
  }

  stop(){
    this.container.remove();
    if (this.container.classList.contains("js-card")){
      this.container.classList.remove("js-card");
    }
    if (document.body.classList.contains("js-block")){
      document.body.classList.remove("js-block");
    }
  }

  render(): HTMLElement {
    if (this.type === "card") this.container.classList.add("js-card");
    if (!this.type) {
      document.body.classList.add("js-block");
    }
    this.container.innerHTML = animation;
    return this.container;
  }
}

export default LoadingAnimation;