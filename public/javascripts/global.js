var requestTableData = [];

//DOM ready
$(document).ready(function() {
    populateTable();
    $('#requestTable table tbody').on('click', 'td a.link_user', showTaskDetails);
    $('#btnAddRequest').on('click', addRequest);
    $('#requestTable table tbody').on('click', 'td a.accept_request', acceptRequest);
});

function populateTable() {
    var tableContent = '';

    $.getJSON( '/users/tasklist', function( data ) {
        requestTableData = data; //saving all data into global variable for demo
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="show_details" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.age + '</td>';
            tableContent += '<td>' + this.gender + '</td>';
            tableContent += '<td>' + this.address + '</td>';
            tableContent += '<td>' + this.date + '</td>';
            tableContent += '<td>' + this.payment + '</td>';
            tableContent += '<td><a href="#" class="accept_request" rel="' + this._id + '">delete</a></td>';
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
    
    $('#emailaddress').text(userObject.email);
    $('#phonenum').text(userObject.phone);
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
            'name' : $('addRequest fieldset input#inputName').val(),
            'age' : $('addRequest fieldset input#inputAge').val(),
            'gender' : $('addRequest fieldset input#inputGender').val(),
            'address' : $('addRequest fieldset input#inputAddress').val(),
            'date' : $('addRequest fieldset input#inputDate').val(),
            'payment' : $('addRequest fieldset input#inputPayment').val(),
            'phone' : $('addRequest fieldset input#inputPhone').val(),
            'email' : $('addRequest fieldset input#inputEmail').val(),
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

function acceptRequest(event) {
    event.preventDefault();
    
    if(confirm("If for some reason you cannot accomplish the task, please contact the original poster.  Click 'yes' if you understand.")) {
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
    
}
