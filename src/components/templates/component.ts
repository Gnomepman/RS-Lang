//Abstract class for component
//Gets the name of the <tag> and class

export default abstract class Component {
    protected container: HTMLElement;
  
    constructor(tagName: string, className: string) {
      this.container = document.createElement(tagName);
      this.container.className = className;
    }
  
    //returns HTMLElement with
    render() {
      return this.container;
    }
}