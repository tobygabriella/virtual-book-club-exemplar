let lastReviewId = 0; // This will be incremented for each new review

document.addEventListener('DOMContentLoaded', () => {
		loadReviews();
		document.getElementById('review-form').addEventListener('submit', handleReviewSubmit);
});

function loadReviews() {
		fetch('reviews.json')
				.then(response => response.json())
				.then(reviews => {
						const reviewsList = document.getElementById('reviews-list');
						reviews.forEach(review => {
								const reviewElement = createReviewElement(review);
								reviewsList.appendChild(reviewElement);
						});
				})
				.catch(error => console.error('Error loading reviews:', error));
}

function createReviewElement(review) {
		const div = document.createElement('div');
		div.className = 'review-item';
		div.innerHTML = `
				<h3>${review.title}</h3>
				<p>${review.reviewText}</p>
				<p>Rating: ${review.rating}</p>
				<button class="like-btn" data-id="${review.id}" data-liked="false" onclick="toggleLike(this)">Like (${review.likes})</button>
				<button class="repost-btn" data-id="${review.id}" onclick="repostReview(this)">Repost (${review.reposts})</button>
		`;
		return div;
}

function handleReviewSubmit(event) {
		event.preventDefault();
		const title = document.getElementById('book-title').value;
		const reviewText = document.getElementById('review-text').value;
		const rating = document.getElementById('rating').value;

		// Increment the lastReviewId for the new review
		lastReviewId += 1;

		const newReview = {
				id: lastReviewId, // Use the incremented lastReviewId
				title,
				reviewText,
				rating,
				likes: 0,
				reposts: 0
		};

		const reviewsList = document.getElementById('reviews-list');
		reviewsList.insertBefore(createReviewElement(newReview), reviewsList.firstChild);
		event.target.reset(); // Reset the form fields
}

function toggleLike(button) {
		const reviewId = button.getAttribute('data-id');
		const isLiked = button.getAttribute('data-liked') === 'true';
		let likesCount = parseInt(button.textContent.match(/\d+/)[0], 10); // Extract the number of likes from the button text

		if (isLiked) {
				// If the review is already liked, decrease the like count and update the button
				likesCount -= 1;
				button.textContent = `Like (${likesCount})`;
				button.setAttribute('data-liked', 'false');
		} else {
				// If the review is not liked, increase the like count and update the button
				likesCount += 1;
				button.textContent = `Like (${likesCount})`;
				button.setAttribute('data-liked', 'true');
		}
}

function repostReview(button) {
		const reviewId = button.getAttribute('data-id');
		const repostsText = button.textContent;
		const repostsCount = parseInt(repostsText.match(/\d+/)[0], 10); // Extract the number of reposts from the button text

		// Assuming each repost button's text follows the format "Repost (number)"
		button.textContent = `Repost (${repostsCount + 1})`; // Increment repost count
}
