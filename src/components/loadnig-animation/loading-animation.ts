import Component from "../templates/component";
import { animation } from "./animation";
import "./loading-animation.scss";

class LoadingAnimation extends Component{
  divClass:string;
  constructor(tagName: string, className: string,divClass:string) {
    super(tagName,className);
    this.divClass = divClass;
  }
  
  start(){
    const main = document.querySelector(`.${this.divClass}`) as HTMLDivElement;
    main.append(this.render());
    document.body.classList.add("js-block");
  }

  stop(){
    this.container.remove();
    document.body.classList.remove("js-block");
  }

  render(): HTMLElement {
    this.container.innerHTML = animation;
    return this.container;
  }
}

export default LoadingAnimation;