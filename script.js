// section to either add a new bookmark or view the list of bookmarks of a particular category.

const mainSection = document.getElementById('main-section');
const categoryDropdown = document.getElementById('category-dropdown');
const viewCategoryBtn = document.getElementById('view-category-button');
const addBookmarkBtn = document.getElementById('add-bookmark-button');

// section to add a new bookmark of a selected category

const formSection = document.getElementById('form-section');
const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const closeFormBtn = document.getElementById('close-form-button');
const addBookMarkBtnForm = document.getElementById('add-bookmark-button-form');
const categoryNameForm = formSection.querySelector('.category-name');

// section to view bookmark lists and delete bookmarks

const bookMarkListSection = document.getElementById('bookmark-list-section');
const categoryList = document.getElementById('category-list');
const closeListBtn = document.getElementById('close-list-button');
const deleteBookMarkBtn = document.getElementById('delete-bookmark-button');
const categoryNameList = bookMarkListSection.querySelector('.category-name');

let currentBookMark = {};

const getBookmarks = () => {
  const bookMarks = localStorage.getItem('bookmarks');

  if (!bookMarks) return [];

  try {
    const parsed = JSON.parse(bookMarks);

    const isValidBookMarksArray = Array.isArray(parsed) && 
      parsed.every((item) => 
        item && typeof item === 'object' && typeof item.name === 'string' && typeof item.url === 'string' && typeof item.category === 'string');

    return isValidBookMarksArray ? parsed : [];
  } catch {
    return [];
  }
};

const displayHeading = (heading) => {
  const category = categoryDropdown.value;
  const categoryHeading = category.charAt(0).toUpperCase() + category.slice(1, category.length); 
  heading.innerText = categoryHeading;
};

const displayOrCloseForm = () => {
  mainSection.classList.toggle('hidden');
  formSection.classList.toggle('hidden');

  if (!formSection.classList.contains('hidden')) {
    displayHeading(categoryNameForm);
  }
};

const updateBookMarks = () => {
  const bookMarks = getBookmarks();
  currentBookMark = {
    name: nameInput.value.trim(),
    category: categoryDropdown.value,
    url: urlInput.value
  };
  bookMarks.push(currentBookMark);
  localStorage.setItem('bookmarks', JSON.stringify(bookMarks));
  reset();
  displayOrCloseForm();
};

const reset = () => {
  nameInput.value = '';
  urlInput.value = '';
  currentBookMark = {};
};

const displayOrHideCategory = () => {
  mainSection.classList.toggle('hidden');
  bookMarkListSection.classList.toggle('hidden');
  
  if (!bookMarkListSection.classList.contains('hidden')) {
    displayHeading(categoryNameList);
    
  }
};

const displayBookMarks = (category) => {
  categoryList.innerHTML = "";

  const bookMarks = getBookmarks();

  const filteredBookMarks = bookMarks.filter((bookMark) => bookMark.category === category);

  if (!filteredBookMarks.length) {
    categoryList.innerHTML = '<p>No Bookmarks Found</p>';
    return;
  } else {
    filteredBookMarks.forEach(({name, category, url}) => {
      categoryList.innerHTML += `
        <div>
          <input type="radio" id="${name}" value="${name}" name="${category}"/>
          <label for="${name}"><a href="${url}">${name}</a></label>
        </div>
      `;
    });
  }
};

const deleteBookMark = () => {
  const selectedBookMark = categoryList.querySelector('input[type="radio"]:checked');
  const bookMarkName = selectedBookMark.value;
  const category = categoryDropdown.value;

  let bookMarks = getBookmarks();

  bookMarks = bookMarks.filter((bookMark) => 
    !(bookMark.name === bookMarkName && bookMark.category === category)
  );

  localStorage.setItem('bookmarks', JSON.stringify(bookMarks));
  displayBookMarks(category);
};

addBookmarkBtn.addEventListener('click', displayOrCloseForm);
closeFormBtn.addEventListener('click', displayOrCloseForm);

addBookMarkBtnForm.addEventListener('click', updateBookMarks);

viewCategoryBtn.addEventListener('click', () => {
  displayOrHideCategory();
  displayBookMarks(categoryDropdown.value);
});
closeListBtn.addEventListener('click', displayOrHideCategory);

deleteBookMarkBtn.addEventListener('click', deleteBookMark);