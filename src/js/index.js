// Описаний в ТЗ до ДЗ
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import { fetchImg } from './searcher.js';

const elements = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

elements.form.addEventListener('submit', handlerSubmit);
elements.moreBtn.addEventListener('click', handlerClickLoad);

let page;
let onPage;

async function handlerSubmit(evt) {
  evt.preventDefault();
  elements.moreBtn.classList.add('hidden');
  const { searchQuery } = evt.target;
  page = 1;
  onPage = 40;
  try {
    const result = await fetchImg(searchQuery.value, onPage, page);

    if (result.hits.length > 0) {
      Notify.success(`Hooray! We found ${result.totalHits} images.`);
      console.log(result.hits.length);
      elements.gallery.innerHTML = createMarkup(result.hits);

      lightScroll();

      let lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      if (result.totalHits > onPage) {
        elements.moreBtn.classList.remove('hidden');
        queryValue = searchQuery.value;
        return queryValue;
      }
    } else {
      elements.gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
    console.log('Length-', result.hits.length);
  }
}

async function handlerClickLoad() {
  page += 1;

  try {
    const result = await fetchImg(queryValue, onPage, page);
    elements.gallery.insertAdjacentHTML('beforeend', createMarkup(result.hits));
    lightScroll();

    let lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      //   nav: 'false',
      //   navText: 'arrows',
    });
    lightbox.refresh();

    if (Math.ceil(result.totalHits / onPage) === page) {
      elements.moreBtn.classList.add('hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="cardset">
      <a class="card-image" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="cardData">
            <p class="cardData-item">
                <b>Likes</b>
                ${likes}
            </p>
            <p class="cardData-item">
                <b>Views</b>
                ${views}
            </p>
            <p class="cardData-item">
                <b>Comments</b>
                ${comments}
            </p>
            <p class="cardData-item">
                <b>Downloads</b>
                ${downloads}
            </p>
        </div>
        </div>`
    )
    .join('');
}

function lightScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
