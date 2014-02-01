$(function(){
	$('#form-alterar-nome').submit(function(){
		var nome = $('#nome').val();
		socket.emit('change name', {nome: nome, room: room});
    $('#nome').attr('disabled','disabled');
    $(this).children('button').hide();
		return false;
	});

	$('#form-enviar-mensagem').submit(function(){
		var mensagem = $('#mensagem').val();
		socket.emit('send message', {message: mensagem, room: room});
    $('#mensagem').val('').focus();

		return false;
	});
	
	$('.room-url').val(window.location.href);
});