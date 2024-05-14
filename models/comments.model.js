const Mysql = require('mysql2');
const EJS = require('ejs');
const Path = require('path');

const DatabaseModel = require('./database.model');

class CommentsModel extends DatabaseModel {

    constructor(){
        super();
    }

    /* Function to create a comment */
    createComment = async(params, name) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_comment_query = Mysql.format(`INSERT INTO comments (user_id, message_id, content, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW())`, Object.values(params));
            let create_comment_response = await this.executeQuery(create_comment_query);
            let insert_id = create_comment_response.result?.insertId;

            if(insert_id){
                let fetch_comment_query = Mysql.format(`SELECT DATE_FORMAT(created_at, '%Y-%b-%e %H:%i:%s') AS comment_created_at FROM comments WHERE id = ?`, [insert_id]);
                let { result: [{comment_created_at}] } = await this.executeQuery(fetch_comment_query);
                response_data = create_comment_response;

                let comment_data = {
                    name,
                    id: insert_id,
                    message_id: params.message_id,
                    content: params.content,
                    created_at: comment_created_at
                }

                /* Generate a partial html for cooment */
                response_data.html = await EJS.renderFile(Path.join(__dirname, "../views/partials/comment.ejs"), { comment_data }, { async: true });
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to create a comment.";
        }

        return response_data;
    }

    /* Function to delete a comment */
    deleteComment = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE id = ? AND user_id = ?;`, Object.values(params));
            response_data = await this.executeQuery(delete_comment_query);
            response_data.status = !!response_data.result.affectedRows;

            if(!response_data.result.affectedRows){
                response_data.message = "Non-author comments cannot delete."   
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to delete a comment.";
        }

        return response_data;
    }
}

module.exports = CommentsModel;