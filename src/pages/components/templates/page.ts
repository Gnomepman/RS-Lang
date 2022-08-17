abstract class Page {
    protected container: HTMLElement;
    static TextObject = {};
  
    constructor(id: string) {
      this.container = document.createElement('div');
      this.container.id = id;
    }
  
    protected createHeaderTitle(text: string) {
      const headerTitle = document.createElement('h1');
      headerTitle.innerText = text;
      return headerTitle;
    }

    protected createDivBlock(className?: string){
      const block = document.createElement('div');
      if (className) block.classList.add(className)
      return block;
    }
  
    render() {
      return this.container;
    }
  }
  
  export default Page;