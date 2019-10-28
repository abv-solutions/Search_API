import reddit from './reddit_api'

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const search = document.querySelector('#search');

searchForm.addEventListener('submit', e => {
	e.preventDefault();
	const searchTerm = searchInput.value;
	const sortBy = document.querySelector('input[name="sortby"]:checked').value;
	const searchLimit = document.querySelector('#limit').value;
	if (searchTerm === '') {
		showAlert('Please type in a search term', 'danger');
	}
	searchInput.value = '';
	reddit.search(searchTerm, sortBy, searchLimit)
		.then(results => {
			let output = '<div class="card-columns">';
			results.forEach(post => {
				let image = post.preview
					? post.preview.images[0].source.url
					: 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';
				output += `
        <div class="card mb-2">
          <img class="card-img-top" src="${image}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${truncateText(post.title, 100)}</h5>
            <p class="card-text">${truncateText(post.selftext, 100)}</p>
            <a href="${post.url}" target="_blank" class="btn btn-dark">Read More</a>
            <hr>
            <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
            <span class="badge badge-dark">Score: ${post.score}</span>
          </div>
        </div>
        `;
			});
			output += '</div>';
			document.querySelector('#results').innerHTML = output;
		});
});

function showAlert(message, className) {
	const div = document.createElement('div');
	div.className = `alert alert-${className}`;
	div.appendChild(document.createTextNode(message));
	search.before(div);
	setTimeout(() => document.querySelector('.alert').remove(), 2000);
}

function truncateText(text, limit) {
	const endIndex = text.indexOf(' ', limit);
	if (endIndex == -1) {
		return text;
	}
	return text.substring(0, endIndex);
}
