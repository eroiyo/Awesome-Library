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

let bookList = [];

if (storageAvailable('localStorage')) {
  bookList = JSON.parse(localStorage.getItem('bookList'));
  if (bookList === null) {
    bookList = [
      {
        title: 'elisha',
        author: 'good',
        id: 0,
      },
    ];
  }
}

let idCount = bookList.length;
const bookUl = document.querySelector('.book-list');

function remove(id) {
  const objective = document.getElementById(id);
  objective.remove();
  bookList = bookList.filter((book) => book.id !== id);
  localStorage.setItem('bookList', JSON.stringify(bookList));
}

function hidden() {
  while (bookUl.lastElementChild) {
    bookUl.removeChild(bookUl.lastElementChild);
  }
}

function showbook() {
  hidden();
  for (let i = 0; i < bookList.length; i += 1) {
    const removeButton = document.createElement('button');
    const bookContainer = document.createElement('div');
    const bookTitle = document.createElement('h2');
    const bookAuthor = document.createElement('h2');
    bookList[i].id = i;
    const bookObjective = bookList[i];
    removeButton.textContent = 'Remove';

    bookTitle.textContent = bookObjective.title;
    bookAuthor.textContent = bookObjective.author;

    bookContainer.appendChild(bookTitle);
    bookContainer.appendChild(bookAuthor);
    bookContainer.appendChild(removeButton);
    bookContainer.setAttribute('id', bookObjective.id);
    bookUl.appendChild(bookContainer);
    removeButton.onclick = () => {
      remove(bookObjective.id);
    };
  }
}

const addBook = () => {
  const book = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    id: idCount,
  };
  idCount += 1;
  bookList.push(book);
  localStorage.setItem('bookList', JSON.stringify(bookList));

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
