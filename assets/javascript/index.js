$(document).ready( () => {
    $(document)
        .on('submit', '#login_form', loginUser)
        .on('submit', '#register_form', registerUser)
        .on('submit', '#create_message', createMessage)
        .on('submit', '.create_comment', createComment)
        .on('click', '.delete_message', deleteMessage)
        .on('click', '.delete_comment', deleteComment)
});

/* Reusable function */
const requestData = (element, callback) => {
    $.post($(element).attr('action'), $(element).serialize(), (response_data) => {
        callback(response_data);
    }, 'json');
};

const deleteData = (element, callback) => {
    $.post($(element).attr('href'), (response_data) => {
        callback(response_data);
    }, 'json');
}

/* Post functions */
const createMessage = function(e){
    e.preventDefault();

    requestData(this, (response_data) => {
        if(response_data.status){
            $(this).siblings('div').prepend(response_data.html);
            $(this).children('textarea').val('');
        }
        else{
            alert(response_data.message);
        }
    });

    return false;
}

const createComment = function(e){
    e.preventDefault();

    requestData(this, (response_data) => {
        if(response_data.status){
            $(this).siblings('ul').append(response_data.html);
            $(this).children('textarea').val('');
        }
        else{
            alert(response_data.message)
        }
    });

    return false;
}

/* Delete functions */
const deleteMessage = function(e){
    e.preventDefault();

    deleteData(this, (response_data) => {
        if(response_data.status){
            $(this).parent('p').parent('li').remove();
        }
        else{
            alert(response_data.message);
        }
    });

    return false;
}

const deleteComment = function(e){
    e.preventDefault();

    deleteData(this, (response_data) => {
        if(response_data.status){
            $(this).parent('p').parent('li').remove();
        }
        else{
            alert(response_data.message);
        }
    });

    return false;
}

/* Homepage Features function */
const loginUser = function(e){
    e.preventDefault();

    requestData(this, (response_data) => {
        if(response_data.status){
            window.location.href = "/wall";
        }
        else{
            alert(response_data.message);
        }
    });

    return false;
}

const registerUser = function(e){
    e.preventDefault();

    requestData(this, (response_data) => {
        if(!response_data.status){
            alert(response_data.message);
        }
    });

    return false;
}