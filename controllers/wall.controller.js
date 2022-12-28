
const { validateFields } = require('../helpers/index.helper');

const MessagesModel = require('../models/messages.model');
const CommentsModel = require('../models/comments.model');

class WallController {
    #req;
    #res;

    constructor(req, res){
        this.#req = req;
        this.#res = res;

        if(!this.#req.session?.users?.id){
            this.#req.session.destroy();
            this.#res.redirect('wall');
        }
    }

    /* Function to visit and load the wallpage */
    wallpage = async () => {
        let messagesModel = new MessagesModel();
        let { result: messages_data } = await messagesModel.fetchMessagesAndComments();

        this.#res.render('layouts/wallpage', { first_name: this.#req.session?.users?.first_name, messages_data });
    }

    /* Function to create a message */
    createMessage = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.body, ['content']);
            response_data = validate_fields;

            if(validate_fields.status){
                let messagesModel = new MessagesModel();
                response_data = await messagesModel.createMessage({user_id: this.#req.session.users.id, content: validate_fields.result.sanitized_fields.content}, this.#req.session.users.name);
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error in creating a message."
        }

        this.#res.json(response_data);
    }

    /* Function to create a comment */
    createComment = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.body, ['message_id', 'content']);
            response_data = validate_fields;

            if(validate_fields.status){
                let { message_id, content } = validate_fields.result.sanitized_fields;

                let commentsModel = new CommentsModel();
                response_data = await commentsModel.createComment({user_id: this.#req.session.users.id, message_id, content }, this.#req.session.users.name);
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error in creating a comment."
        }

        this.#res.json(response_data);
    }

    /* Function to delete a message */
    deleteMessage = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.params, ['message_id']);
            response_data = validate_fields;

            if(validate_fields.status){
                let messagesModel = new MessagesModel();
                response_data = await messagesModel.deleteMessage({ message_id: validate_fields.result.sanitized_fields.message_id, user_id: this.#req.session.users.id });
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error in deleting a message."
        }

        this.#res.json(response_data);
    }

    /* Function to delete a comment */
    deleteComment = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.params, ['comment_id']);
            response_data = validate_fields;

            if(validate_fields.status){
                let commentsModel = new CommentsModel();
                response_data = await commentsModel.deleteComment({ comment_id: validate_fields.result.sanitized_fields.comment_id, user_id: this.#req.session.users.id });
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error in deleting a comment."
        }

        this.#res.json(response_data);
    }
}

module.exports = WallController;