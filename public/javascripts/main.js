$(document).ready(function () {
	if (!window.console) window.console = {};
	if (!window.console.log) window.console.log = function () {
	};

	let postId = $('.post').last().attr('id');
	updater.cursor = parseInt(postId.substring(1, postId.length));
	console.log(updater.cursor);
	updater.poll();
});

var updater = {
	errorSleepTime: 500,
	cursor: null,

	poll: function () {
		var args = {"lastId": updater.cursor};
		if (updater.cursor) args.cursor = updater.cursor;
		$.ajax({
			url: "/updates", type: "POST", dataType: "text",
			data: $.param(args), success: updater.onSuccess,
			error: updater.onError
		});
	},

	onSuccess: function (response) {
		try {
			updater.newPosts(eval("(" + response + ")"));
		} catch (e) {
			updater.onError();
			return;
		}
		updater.errorSleepTime = 500;
		window.setTimeout(updater.poll, 0);
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
		let existing = $("#p" + post.id);
		if (existing.length > 0) return;
		let node = $('<div class="post" id="p' + post.id + '">\n' +
			'    <h3>' + post.title + '</h3>\n' +
			'    <div class="text-handler">\n' +
			post.body +
			'    </div>\n' +
			'    <i>Author: ' + post.author + '</i>\n' +
			'</div>');
		node.hide();
		$("#post_container").append(node);
		node.slideDown();
	}
};