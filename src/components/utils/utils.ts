
const createElement = (tag:string,className:string):HTMLElement => {
  const elem = document.createElement(tag);
  elem.className = className;
  return elem;
}


const savePageToSessionStorage = (page:number)=>{
  sessionStorage.setItem("currentPage",page.toString(10));
}

const saveGroupToSessionStorage = (group:number)=>{
  sessionStorage.setItem("currentGroup",group.toString(10));
}

const getPageFromSessionStorage = ():string | null =>{
  return sessionStorage.getItem("currentPage");
}

const getGroupFromSessionStorage = ():string | null =>{
  return sessionStorage.getItem("currentGroup");
}

export {createElement,savePageToSessionStorage,saveGroupToSessionStorage,getPageFromSessionStorage,getGroupFromSessionStorage};