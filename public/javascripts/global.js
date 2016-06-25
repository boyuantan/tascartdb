var requestTableData = [];

//DOM ready
$(document).ready(function() {
    populateTable();
    $('#requestTable table tbody').on('click', 'td a.link_user', showTaskDetails);
    $('#btnAddRequest').on('click', addRequest);
    $('#requestTable table tbody').on('click', 'td a.link_delete', deleteRequest);
});

function populateTable() {
    //soon-usable content
    var tableContent = '';


    $.getJSON( '/users/tasklist', function( data ) {
        requestTableData = data; //saving all data into global variable for demo
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="link_user" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.address + '</td>';
            tableContent += '<td><a href="#" class="link_delete" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        $('#requestTable table tbody').html(tableContent);
    });
};

function showTaskDetails() {
    event.preventDefault();
    
    var username = $(this).attr('rel');
    var arrayPosition = requestTableData.map(function(arrayItem) {return arrayItem.name;}).indexOf(username);
    
    var userObject = requestTableData[arrayPosition];
    
    $('#taskinfo').text(userObject.details);
};

function addRequest(event) {
    event.preventDefault();
    
    var validRequest = true;
    $('#addRequest input').each(function(index, val) {
        if($(this).val() === '') { validRequest = false; }
    });
    
    if (validRequest) {
        var newRequest = {
            'username' : $('addRequest fieldset input#inputName').val(),
            'address' : $('addRequest fieldset input#inputAddress').val(),
            'details' : $('addRequest fieldset input#inputDetails').val()
        };
        
        $.ajax({
            type : 'POST',
            data : newRequest,
            url : '/users/postreq',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === "") {
                //successful -- clear all inputs
                $('#addRequest fieldset input').val("");
                populateTable();
            }
        });
    } else {
        alert("All fields must have valid input.");
        return false;
    }
}

function deleteRequest(event) {
    event.preventDefault();
    
    $.ajax({
        type: 'DELETE',
        url: 'users/deletereq/' + $(this).attr('rel')
    }).done(function(response) {
        if (response.msg !== "") {
            alert('Error: ' + response.msg);
        }
        
        populateTable();
    });
}
