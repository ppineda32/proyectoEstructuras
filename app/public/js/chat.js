var socket = io();
var chatUsername = window.localStorage.getItem('user');
var chatMessage = document.querySelector('#chat-message');
var searchMessage = document.querySelector('#search-message');
var chatRecipient;

socket.on('connect', function(){
	var chatForm = document.forms.chatForm;
	var search = document.querySelector('#search-btn');

	socket.emit('username', {
		user:chatUsername
	});
		
	chatForm.addEventListener('submit',function(e){
		e.preventDefault();

		chatRecipient = $("input:radio[name='Radios1']:checked").val();

		if(chatRecipient!=undefined){
			socket.emit('postMessage', {
				sender : chatUsername,
				recipient : chatRecipient,
				message: chatMessage.value
			});

			chatMessage.value='';
			chatMessage.focus();
		}else{
			var chatDisplay = document.querySelector('.chat-display');
			var newMessage = document.createElement('p');
			newMessage.innerHTML = 'Select a friend';
			chatDisplay.insertBefore(newMessage, chatDisplay.firstChild);
		}
	});

	search.addEventListener('click',function(e){
		e.preventDefault();
		chatRecipient = $("input:radio[name='Radios1']:checked").val();

		if(chatRecipient!=undefined){
			socket.emit('search', {
				sender : chatUsername,
				recipient : chatRecipient,
				message: searchMessage.value
			});

			searchMessage.value='';
		}else{
			var searchDisplay = document.querySelector('#search-display');
			var newMessage = document.createElement('p');
			newMessage.innerHTML = 'Select a friend';
			searchDisplay.insertBefore(newMessage, searchDisplay.firstChild);
		}
	});

	function getMessages(){
		var chatRecipient = $("input:radio[name='Radios1']:checked").val();

		socket.emit('getMessages',{
			sender:chatUsername,
			recipient:chatRecipient
		});
	}

	socket.on('newMessages',function(data){
		getMessages();
	});	

	socket.on('updateMessages',function(data){
		showMessage(data);
	});	

	socket.on('updateSearch',function(data){
		showSearch(data);
	});	

	socket.on('setUsers',function(data){
		$('#radios').empty();
		jQuery.each(data, function(i, val) {
			if(val.user!=chatUsername){
				var label = document.createElement("label");
				var x = document.createElement("input");
				x.setAttribute("type", "radio");
				x.name = "Radios1";
				x.value = val.user;
				x.addEventListener('click',getMessages);          
				if(val.user===chatRecipient){
					x.checked = true;
				}
				label.appendChild(x);
				label.appendChild(document.createTextNode(val.user));
				$('#radios').append(label);
				$('#radios').append('</br>');
			}
		});
	});
});


function showMessage(data){
	$('.chat-display').empty();
	jQuery.each(data, function(i, val) {
		var chatDisplay = document.querySelector('.chat-display');
		var newMessage = document.createElement('p');
		newMessage.innerHTML = '<strong>' + val.sender + '</strong>: '+ val.message;
		chatDisplay.insertBefore(newMessage, chatDisplay.firstChild);
	});
}

function showSearch(data){
	$('#search-display').empty();
	jQuery.each(data, function(i, val) {
		var searchDisplay = document.querySelector('#search-display');
		var newMessage = document.createElement('p');
		newMessage.innerHTML = '<strong>' + val.sender + '</strong>: '+ val.message;
		searchDisplay.insertBefore(newMessage, searchDisplay.firstChild);
	});
}
