class MovieService {
    
    optionBuilder ()=>
    
    
    GetTopRated() {
        const options = {
            method: 'GET',
            headers: { accept: 'application/json', Authorization: 'Bearer {}' }
        };

        fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }
}