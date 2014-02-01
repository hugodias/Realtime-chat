function generateGuid() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j == 8 || j == 12|| j == 16|| j == 20) 
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}

var socket = io.connect('http://localhost');

$(function(){
	$('.linkto').attr('href', '/r/' + generateGuid());
  
  socket.on('rooms', function(data) {
    var ks = Object.keys(data);
    var len = ks.length;

    console.log(data);

    // Limpa a lista
    $('#list-rooms').html('');

    for (var i = 1; i < len ; i++) {
      var rlink = ks[i].split("/")[1];
      $('#list-rooms').append('<li><a href="/r'+ks[i]+'">'+rlink+'</a></li>');
    };
  });

  socket.on('new room', function(room) {
    $('#list-rooms').append('<li><a href="/r/'+room+'">'+room+'</a></li>');
  })
});