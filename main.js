// Do your work here...
console.log('Hello, world!');
window.onload = function() {
    alert("👋 Hai Saya Satya Adil Faishal!");
};

document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const searchBookForm = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    let books = JSON.parse(localStorage.getItem('books')) || [];
    let editingBookId = null;

    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function createBookElement(book) {
        const bookElement = document.createElement('div');
        bookElement.setAttribute("data-bookid", book.id);
        bookElement.setAttribute("data-testid", "bookItem");
        bookElement.classList.add('book-item');
        bookElement.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai' : 'Selesai dibaca'}</button>
                <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                <button data-testid="bookItemEditButton">Edit Buku</button>
            </div>
        `;

        bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => toggleBook(book.id));
        bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => deleteBook(book.id));
        bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => editBook(book.id));

        return bookElement;
    }

    function renderBooks(filteredBooks = books) {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        filteredBooks.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    function deleteBook(bookId) {
        if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
            books = books.filter(book => book.id !== bookId);
            saveBooks();
            renderBooks();
        }
    }

    function toggleBook(bookId) {
        books = books.map(book => book.id === bookId ? { ...book, isComplete: !book.isComplete } : book);
        saveBooks();
        renderBooks();
    }

    function editBook(bookId) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            document.getElementById('bookFormTitle').value = book.title;
            document.getElementById('bookFormAuthor').value = book.author;
            document.getElementById('bookFormYear').value = book.year;
            document.getElementById('bookFormIsComplete').checked = book.isComplete;
            editingBookId = bookId;
        }
    }

    function addBook(event) {
        event.preventDefault();
        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = Number(document.getElementById('bookFormYear').value);
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        if (!title || !author || !year) return;

        const newBook = { id: new Date().getTime(), title, author, year, isComplete };
        books.push(newBook);
        saveBooks();
        renderBooks();
        bookForm.reset();
    }

    function searchBook() {
        const query = searchBookTitle.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
        renderBooks(filteredBooks);
    }

    bookForm.addEventListener('submit', addBook);
    searchBookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBook();
    });

    renderBooks();
});


// update