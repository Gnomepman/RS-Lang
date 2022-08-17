
const createElement = (tag:string,className:string):HTMLElement => {
  const elem = document.createElement(tag);
  elem.className = className;
  return elem;
}

export {createElement};