var requestTableData = [];

//DOM ready
$(document).ready(function() {
    
    populateTable(); //fill table when document loads
    
    //when a name is clicked in the table, the details of the task open up
    $('#requestTable table tbody').on('click', 'td a.show_details', showTaskDetails);
    
    //when a user clicks to accept the request on the table
    $('#requestTable table tbody').on('click', 'td a.accept_request', acceptRequest);
    
    //when a user fills in the request sheet and clicks on submit button
    $('#btnAddRequest').on('click', addRequest);
    
});

function populateTable() {
    var tableContent = '';
    //variable to store the contents of the data from each object in array
    
    $.getJSON('/users/tasklist', function(data) {
        requestTableData = data; //going through all elements of array
        
        $.each(data, function(){ //add each element in
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="show_details" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.age + '</td>';
            tableContent += '<td>' + this.gender + '</td>';
            tableContent += '<td>' + this.address + '</td>';
            tableContent += '<td>' + this.date + '</td>';
            tableContent += '<td>' + this.payment + '</td>';
            tableContent += '<td><a href="#" class="accept_request" rel="' + this._id + '">Accept Request</a></td>';
            tableContent += '</tr>';
        });

        $('#requestTable table tbody').html(tableContent); //table is filled with content
    });
};

function showTaskDetails() {
    event.preventDefault();
    
    //the index of the name is used to find the index of the object stored in the global array
    var username = $(this).attr('rel');
    var arrayPosition = requestTableData.map(function(arrayItem) {return arrayItem.name;}).indexOf(username);
    
    var userObject = requestTableData[arrayPosition];
    
    //the details of the request are made available for viewing
    $('#emailaddress').text(" " + userObject.email);
    $('#phonenum').text(" " + userObject.phone);
    $('#taskinfo').text(" " + userObject.details);
};

function addRequest(event) {
    event.preventDefault();
    
    var validRequest = true;
    
    //validation to ensure no field is blank
    $('#addRequest input').each(function(index, val) {
        if($(this).val() === '') { 
            validRequest = false; 
        }
    });
    
    if (validRequest) {
        
        var newRequest = { //values of input fields are collected
            'name' : $('#inputName').val(),
            'age' : $('#inputAge').val(),
            'gender' : $('#inputGender').val(),
            'address' : $('#inputAddress').val(),
            'date' : $('#inputDate').val(),
            'payment' : $('#inputPayment').val(),
            'phone' : $('#inputPhone').val(),
            'email' : $('#inputEmail').val(),
            'details' : $('#inputDetails').val()
        };
        
        $.ajax({ //ajax call to post json data, later saved to tasklist collection
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
        $.ajax({ //ajax call to delete task info
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
