import axios from 'axios';

export class fetchImages {
    static URL = 'https://pixabay.com/api/';
    static API_KEY = '35241360-d8dd61788fda51c15adfb22e2';
    static page = 1;
    static query = ''; 
    static per_page = 40;

    static fetchPhotosByQuery() {
        const params = new URLSearchParams({
            key: fetchImages.API_KEY,
            page: fetchImages.page,
            q:  fetchImages.query,
            per_page: fetchImages.per_page,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        })
      return axios.get(`${fetchImages.URL}?${params}`);
    }
}    