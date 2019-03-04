document.addEventListener('DOMContentLoaded', function () {

	var updater = {
		errorSleepTime: 500,
		cursor: null,

		poll: function () {
			var args = {"lastId": updater.cursor};
			var request = new XMLHttpRequest();
			request.open('POST', 'http://localhost:5000/updates', true);
			request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					// Success!
					updater.onSuccess(JSON.parse(this.responseText))
				} else {
					// We reached our target server, but it returned an error
					console.log('404 or server side error')
				}
			};

			request.onerror = function() {
				// There was a connection error of some sort
				updater.onError(this.response)
			};

			request.send(JSON.stringify(args));
		},

		onSuccess: function (response) {
			try {
				if (response['success'] === true)
					updater.newPosts(response);
			} catch (e) {
				updater.onError();
				return;
			}
			updater.errorSleepTime = 500;
			window.setTimeout(updater.poll, 250);
		},

		onError: function (response) {
			updater.errorSleepTime *= 2;
			console.log(response);
			console.log("Poll error; sleeping for", updater.errorSleepTime, "ms");
			window.setTimeout(updater.poll, updater.errorSleepTime);
		},

		newPosts: function (response) {
			if (!response.data) return;
			let posts = response.data;
			updater.cursor = posts[posts.length - 1].id;
			console.log(posts.length, "new posts, last id:", updater.cursor);
			for (let i = 0; i < posts.length; i++) {
				updater.showPost(posts[i]);
			}
		},

		showPost: function (post) {
			let existing = document.querySelector("#p" + post.id);
			if (existing != null) return;
			createNode(post);
		}
	};

	function createNode(post) {
		var newEl = template.cloneNode(true);
		newEl.id = 'p' + post.id;
		newEl.querySelector('.post-title').textContent = post.title;
		newEl.querySelector('.post-text').textContent = post.body;
		newEl.querySelector('.post-author').textContent = post.author;
		container.append(newEl);
		newEl.style.display = 'block';
	}

	var template = document.getElementById('p_id');
	var container = document.getElementById('post_container');
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:5000/', /* async = */ false);
	request.send();
	var response = JSON.parse(request.responseText);
	if (response['success'] === true)
		response['data'].forEach(function (item) {
			createNode(item)
		});

	let postId = container.lastChild.id;
	updater.cursor = parseInt(postId.substring(1, postId.length));
	updater.poll();

}, false);