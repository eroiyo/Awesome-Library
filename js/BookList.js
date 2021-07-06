class Node {
  constructor(title, id, author, next_node = null) {
    this.title = title;
    this.id = id
    this.author = author
    this.next_node = next_node;
  }
  add(title, id, author) {
    if (this.next_node === null) {
      this.next_node = new Node(title, id, author, null);
    } else {
      this.next_node.add(title, id, author, null);
    }
  }
  get(index, count) {
    if (index == count) {
      return this.title;
    } if (this.next_node !== null) {
      return this.next_node.get(index, count + 1)
    } else {
      return null;
    }
  }
  get_node(index, count) {
    if (index == count) {
      return this;
    } if (this.next_node !== null) {
      return this.next_node.get(index, count + 1)
    } else {
      return null;
    }
  }
  remove(index, count, old) {
    if (index == count) {
      old.next_node = this.next_node;
      return true;
    } if (this.next_node !== null) {
      return this.next_node.remove(index, count + 1, this);
    } else {
      return null;
    }
  }
  removebyId(id, old) {
    if (this.id === id) {
      old.next_node = this.next_node;
      return true;
    } if (this.next_node !== null) {
      return this.next_node.removebyId(id, this);
    } else {
      return null;
    }
  }
  addAt(index, count, value, old) {
    if (index == count) {
      let node = new Node(value, this);
      old.next_node = node;
      return true;
    } if (this.next_node !== null) {
      return this.next_node.addAt(index, count + 1, value, this);
    } else {
      return null;
    }
  }
  showInformation(id) {
    console.log(this)
    const removeButton = document.createElement('button');
    const bookContainer = document.createElement('div');
    const bookTitle = document.createElement('h2');
    const bookAuthor = document.createElement('h2');
    this.id = id;
    removeButton.textContent = 'Remove';

    bookTitle.textContent = this.title;
    bookAuthor.textContent = this.author;

    bookContainer.appendChild(bookTitle);
    bookContainer.appendChild(bookAuthor);
    bookContainer.appendChild(removeButton);
    bookContainer.setAttribute('id', this.id);
    bookUl.appendChild(bookContainer);
    removeButton.onclick = () => {
      const objective = document.getElementById(id);
      objective.remove();
      bookList.removebyId(id)
      let information= 0;
      if(bookList.size > 0){
      information = bookList.saveInformation();
      }else {
        information = [];
      }
      localStorage.setItem('information', JSON.stringify(information));
    }
    if (this.next_node !== null) {
      this.next_node.showInformation(id + 1);
    }
  }
}
class LinkedList {
  // setup head and tail
  constructor() {
    this.head = null;
    this.size = 0;
  }

  add(title, id, author) {
    if (this.head === null) {
      this.head = new Node(title, id, author, null);
    } else {
      this.head.add(title, id, author);
    }
    this.size += 1;
  }
  addAt(index, title, id, author) {
    if (this.head !== null) {
      if (index == 0) {
        this.head = new Node(title, id, author, this.head.next_node);
      } else {
        this.size += 1;
        return this.head.addAt(index, 0, title, id, author, this.head);
      }
    } else {
      this.add(value)
    }
  }
  // Get at index
  get(index) {
    return this.head.get(index, 0);
  }
  get_node(index) {
    return this.head.get_node(index, 0);
  }
  remove(index) {
    this.size = this.size - 1;
    return this.head.remove(index, 0, this.head);
  }
  removebyId(id) {
    if(id===0){
      this.head=null;
      return true;
    }
    this.size = this.size - 1;
    return this.head.removebyId(id, this.head);
  }
  showInformation() {
    if (this.head !== null) {
      this.head.showInformation(0);
    }
  }
  saveInformation() {
    let information = [];
    if (this.head!=null){
    let book = {
      title: this.head.title,
      id: this.head.id,
      author: this.head.author,
    }
    information.push(book);
    let currentNode = this.head.next_node;
    while (currentNode !== null) {
      book.title = currentNode.title;
      book.id = currentNode.id;
      book.author = currentNode.author;
      information.push(book);
      currentNode = currentNode.next_node;
    }
  }
    return information;
  }
  getInformation(information){
    information.forEach(book => {
      this.add(book.title, book.id, book.author);
    });
  }
}

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && (storage && storage.length !== 0);
  }
}

let bookList = new LinkedList;

if (storageAvailable('localStorage')) {
  const information = JSON.parse(localStorage.getItem('information'));
  if (information === null) {
    bookList = new LinkedList()
    bookList.add("Elisha", 0 ,"good")
  }else{
    bookList.getInformation(information);
  }
}

let idCount = bookList.size;
const bookUl = document.querySelector('.book-list');

function hidden() {
  while (bookUl.lastElementChild) {
    bookUl.removeChild(bookUl.lastElementChild);
  }
}

function showbook() {
  hidden();
  bookList.showInformation();
}


const addBook = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const id = idCount;
  bookList.add(title, id, author)
  idCount += 1;
  const information = bookList.saveInformation();
  localStorage.setItem('information', JSON.stringify(information));
  showbook();
};

const clear = () => {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
};

const save = document.getElementById('submit');
save.addEventListener('click', (e) => {
  e.preventDefault();
  addBook();
  clear();
});

showbook();
