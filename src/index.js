import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from './imagesApi';

const refs = {
    formEl: document.querySelector('#search-form'),
    buttonLoadMoreEl: document.querySelector('.load-more'),
    galleryEl: document.querySelector('.gallery'),
}
const lightbox = new SimpleLightbox('.gallery a', {});

const newFetchPhotos = new fetchImages();
refs.buttonLoadMoreEl.classList.add('is-hidden');
console.log(newFetchPhotos);

function renderGalleryImages(imagesArr) {
    const galleryMarkup = imagesArr.map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads } = {}) =>
            `<div class="photo-card">
                <a href="${largeImageURL}" class="image-link">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" class="images" />
                 </a>
                <div class="info">
                    <p class="info-item">
                    Likes: ${likes}
                    </p>
                    <p class="info-item">
                    Views: ${views}
                    </p>
                    <p class="info-item">
                    Comments: ${comments}
                    </p>
                    <p class="info-item">
                    Downloads: ${downloads}
                    </p>
                </div>
            </div>`).join('');
    console.log(galleryMarkup);
    refs.galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
    lightbox.refresh();

}

async function onFormSubmit(event) {
    event.preventDefault();
    fetchImages.query = event.target.elements.searchQuery.value;
    fetchImages.page = 1;
    console.log(fetchImages.query)
    try {
        const response = await fetchImages.fetchPhotosByQuery();
        const { data } = response;
        if (data.total === 0) {
            Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please, try again`)
            refs.galleryEl.innerHTML = '';
            refs.buttonLoadMoreEl.classList.add('is-hidden');
            return
        }
        if (data.totalHits <= fetchImages.per_page) {
            refs.galleryEl.innerHTML = '';
            renderGalleryImages(data.hits);
            refs.buttonLoadMoreEl.classList.add('is-hidden');
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
            return
        }
            refs.galleryEl.innerHTML = '';
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
            renderGalleryImages(data.hits);
            refs.buttonLoadMoreEl.classList.remove('is-hidden');
        if (fetchImages.page === fetchImages.totalHits) {
            refs.buttonLoadMoreEl.classList.add('is-hidden');
        }
        
    } catch (error) {
        console.log(error)
    }
}
async function onUploadMore(event) {
    fetchImages.page += 1;
    try {
    const response = await fetchImages.fetchPhotosByQuery()
    .then(({data}) => {
    refs.galleryEl.insertAdjacentHTML('beforeend', renderGalleryImages(data.hits));
    refs.buttonLoadMoreEl.classList.remove('is-hidden'); 
    })  
    } catch (error) {
     console.log(error) 
    }
}

refs.formEl.addEventListener('submit', onFormSubmit);
refs.buttonLoadMoreEl.addEventListener('click', onUploadMore);
