$(document).on('click', '#lobby-button', function () {
    var index = $(this).attr('data-id');
    var tut = tutorials[index];
    $(this).attr('value', tut.id);
    $('#form').attr('action', 'lobby/'+tut.coursecode+'/'+tut.name);
});

var logoutConfirmation = "Would You Like to Log Out?";
	
$("#logout").on
(
	"click",
	function(event)
	{
		Cookies.remove('token');
		location.reload();
	}
);