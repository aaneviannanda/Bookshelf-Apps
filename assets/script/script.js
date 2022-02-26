//? Global variabel
const books = [];
const RENDER_BOOKS = 'render-books';
const SAVED_BOOKS = 'saved-books'; //Custom event menyimpan data ke local storage
const STORAGE_KEY = 'BOOKSHELF_APPS';

// Check Browser support local storage or Not Support
function cekStorage() /* boolean */ {
    if (typeof Storage === undefined) {
        alert('Browser kamu tidak mendukung local storage!!!');
        return false;
    }
    return true;
}
// Ketika Halaman HTML selesai dimuat di browser
document.addEventListener('DOMContentLoaded', function () {
    const submitInputBook = document.getElementById('inputBook');

    if (cekStorage()) {
        loadDataBooksFromStorage();
    }

    submitInputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
});
// Fungsi save data ke local storage
function saveDataBooks() {
    if (cekStorage()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_BOOKS));
    }
}
// Ambil data dari localStorage, data ini akan disediakan dalam format teks JSON.
document.addEventListener(SAVED_BOOKS, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});
// Fungsi load data from storage
function loadDataBooksFromStorage() {
    const bookListData = localStorage.getItem(STORAGE_KEY);

    let dataBooks = JSON.parse(bookListData);

    if (dataBooks !== null) {
        for (bookList of dataBooks) {
            books.push(bookList);
        }
    }

    document.dispatchEvent(new Event(RENDER_BOOKS));
}

// Fungsi untuk menambahkan buku
function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const getID = getIDBook();
    const booksObject = generateBooksObject(getID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    books.push(booksObject);

    document.dispatchEvent(new Event(RENDER_BOOKS));

    saveDataBooks();
}
// Fungsi getID (Unix ID generate from timestamp)
function getIDBook() {
    return +new Date();
}
// Fungsi untuk membuat Array Of Object Books
function generateBooksObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
}
// Fungsi untuk menampilkan Array Books ke console (RENDER_BOOKS)
document.addEventListener(RENDER_BOOKS, function () {
    const booksNotReaded = document.getElementById('incompleteBookshelfList');
    booksNotReaded.innerHTML = '';

    const booksReaded = document.getElementById('completeBookshelfList');
    booksReaded.innerHTML = '';

    // Looping data dr Array Books
    for (bookItem of books) {
        const bookElement = makeBookElement(bookItem);

        // Pemilihan untuk buku sudah dibaca atau belum
        if (bookItem.isCompleted == true) {
            booksReaded.append(bookElement);
        } else {
            booksNotReaded.append(bookElement);
        }
    }
});
// Fungsi untuk menambahkan element Books
function makeBookElement(booksObject) {
    const titleBooks = document.createElement('h3');
    titleBooks.innerText = booksObject.title;

    const authorBooks = document.createElement('p');
    authorBooks.innerText = `Penulis: ${booksObject.author}`;

    const yearBooks = document.createElement('p');
    yearBooks.innerText = `Tahun: ${booksObject.year}`;

    const containerList = document.createElement('article');
    containerList.classList.add('book_item');
    containerList.append(titleBooks, authorBooks, yearBooks);
    containerList.setAttribute('id', `id-${booksObject.id}`);

    if (booksObject.isCompleted == true) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo');
        undoButton.innerText = 'Belum selesai dibaca';

        const removeButton = document.createElement('button');
        removeButton.classList.add('delete_book');
        removeButton.innerText = 'Hapus buku';

        const editButton = document.createElement('button');
        editButton.classList.add('edit_book');
        editButton.innerText = 'Edit buku';

        const divAction = document.createElement('div');
        divAction.classList.add('action');
        divAction.append(undoButton, removeButton, editButton);

        // undo ke rak belum di baca
        undoButton.addEventListener('click', function () {
            addToIncompleteBookshelfList(booksObject.id);
        });
        // hapus data buku
        removeButton.addEventListener('click', function () {
            const modalButton = document.getElementById('modal_button');
            modalButton.style.display = 'block';

            const validasi = document.querySelector('.validation');
            validasi.addEventListener('click', function () {
                removeBook(booksObject.id);
                modalButton.style.display = 'none';
            });

            const cencelDelete = document.querySelector('.cencel_delete');
            cencelDelete.addEventListener('click', function () {
                modalButton.style.display = 'none';
            });
        });
        // Edit data buku
        editButton.addEventListener('click', function () {
            const editBook = document.getElementById('edit_book');
            editBook.style.display = 'block';

            const bookSubmitNew = document.getElementById('bookSubmitNew');
            bookSubmitNew.addEventListener('click', function (ev) {
                ev.preventDefault();
                editBookDetail(booksObject.id);
                editBook.style.display = 'none';
            });
        });

        containerList.append(divAction);
    } else {
        const checkListButton = document.createElement('button');
        checkListButton.classList.add('redo');
        checkListButton.innerText = 'Tandai sudah dibaca';

        const removeButton = document.createElement('button');
        removeButton.classList.add('delete_book');
        removeButton.innerText = 'Hapus buku';

        const editButton = document.createElement('button');
        editButton.classList.add('edit_book');
        editButton.innerText = 'Edit buku';

        const divAction = document.createElement('div');
        divAction.classList.add('action');
        divAction.append(checkListButton, removeButton, editButton);

        // tambah ke rak sudah dibaca
        checkListButton.addEventListener('click', function () {
            addToCompleteBookshelfList(booksObject.id);
        });
        // hapus data buku
        removeButton.addEventListener('click', function () {
            const modalButton = document.getElementById('modal_button');
            modalButton.style.display = 'block';

            const validasi = document.querySelector('.validation');
            validasi.addEventListener('click', function () {
                removeBook(booksObject.id);
                modalButton.style.display = 'none';
            });

            const cencelDelete = document.querySelector('.cencel_delete');
            cencelDelete.addEventListener('click', function () {
                modalButton.style.display = 'none';
            });
        });
        // Edit data buku
        editButton.addEventListener('click', function () {
            const editBook = document.getElementById('edit_book');
            editBook.style.display = 'block';

            const bookSubmitNew = document.getElementById('bookSubmitNew');
            bookSubmitNew.addEventListener('click', function (ev) {
                ev.preventDefault();
                editBookDetail(booksObject.id);
                editBook.style.display = 'none';
            });
        });

        containerList.append(divAction);
    }
    return containerList;
}
// Fungsi untuk mencari Data Book Berdasarkan ID
function findID(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}
// Fungsi untuk mencari index Data Book Berdasarkan ID
function findIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}
// Fungsi untuk memindahkan buku Ke Rak Selesai Dibaca
function addToCompleteBookshelfList(bookId) {
    const target = findID(bookId);
    if (target == null) {
        return;
    }

    target.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_BOOKS));

    saveDataBooks();
}
// Fungsi undo ke Rak Belum dibaca
function addToIncompleteBookshelfList(bookId) {
    const target = findID(bookId);
    if (target == null) {
        return;
    }

    target.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_BOOKS));

    saveDataBooks();
}
// Fungsi remove data book
function removeBook(bookId) {
    const bookTarget = findIndex(bookId);
    if (bookTarget === -1) {
        return;
    }
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_BOOKS));

    saveDataBooks();
}
// Fungsi edit data Book
function editBookDetail(bookId) {
    const targetEdit = findIndex(bookId);
    if (targetEdit === -1) {
        return;
    }
    const inputNewBookTitle = document.getElementById('inputNewBookTitle').value;
    const inputNewBookAuthor = document.getElementById('inputNewBookAuthor').value;
    const inputNewBookYear = document.getElementById('inputNewBookYear').value;
    const inputNewBookIsComplete = document.getElementById('inputNewBookIsComplete').checked;

    bookItem.title = inputNewBookTitle;
    bookItem.author = inputNewBookAuthor;
    bookItem.year = inputNewBookYear;
    bookItem.isCompleted = inputNewBookIsComplete;

    document.dispatchEvent(new Event(RENDER_BOOKS));

    saveDataBooks();
}
// Fungsi untuk mencari Data Book Berdasarkan title
const searchTitle = document.getElementById('search_title');
searchTitle.addEventListener('click', event => {
    event.preventDefault();

    const inputSearch = document.getElementById('input_search').value.toLowerCase();
    const textSearch = document.querySelectorAll('article');

    for (book of textSearch) {
        const title = book.firstElementChild.textContent.toLowerCase();

        if (title.indexOf(inputSearch) !== -1) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    }
});
