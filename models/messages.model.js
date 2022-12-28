const Mysql = require('mysql');
const EJS = require('ejs');
const Path = require('path');

const DatabaseModel = require('./database.model');

class MessagesModel extends DatabaseModel {

    constructor(){
        super();
    }

    /* Function to fetch messages and comments */
    fetchMessagesAndComments = async () => {
        let response_data = { status: false, result: [], error: null };

        try{
            let fetch_user_query = Mysql.format(
                `SELECT messages.id, messages.content, CONCAT(users.first_name, ' ', users.last_name) AS name, DATE_FORMAT(messages.created_at, '%Y-%b-%e %H:%i:%s') AS created_at,
                    CASE WHEN comments.id IS NULL THEN '[]'
                    ELSE
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', comments.id,
                                'content', comments.content,
                                'name', CONCAT(comment_users.first_name, ' ', comment_users.last_name),
                                'created_at', DATE_FORMAT(comments.created_at, '%Y-%b-%e %H:%i:%s')
                            )
                        ) 
                    END AS comments
                FROM messages
                INNER JOIN users
                    ON users.id = messages.user_id
                LEFT JOIN comments
                    ON comments.message_id = messages.id
                LEFT JOIN users AS comment_users
                    ON comment_users.id = comments.user_id
                GROUP BY messages.id
                ORDER BY messages.id DESC;`
            );

            response_data = await this.executeQuery(fetch_user_query);
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch messages and comments.";
        }

        return response_data;
    }

    /* Function to create a message */
    createMessage = async(params, name) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_message_query = Mysql.format(`INSERT INTO messages (user_id, content, created_at, updated_at) VALUES(?, ?, NOW(), NOW())`, Object.values(params));
            let create_message_response = await this.executeQuery(create_message_query);
            let insert_id = create_message_response.result?.insertId;

            if(insert_id){
                let fetch_message_query = Mysql.format(`SELECT DATE_FORMAT(created_at, '%Y-%b-%e %H:%i:%s') AS message_created_at FROM messages WHERE id = ?`, [insert_id]);
                let { result: [{message_created_at}] } = await this.executeQuery(fetch_message_query);
                response_data = create_message_response;

                let message_data = {
                    name,
                    id: insert_id,
                    content: params.content,
                    created_at: message_created_at
                }

                /* Generate a partial html for message */
                response_data.html = await EJS.renderFile(Path.join(__dirname, "../views/partials/message.ejs"), { message_data }, { async: true });
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to create a message.";
        }

        return response_data;
    }

    /* Function to delete a message and its comments */
    deleteMessage = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let delete_comments_query = Mysql.format(`DELETE FROM comments WHERE message_id = ?;`, [params.message_id]);
            await this.executeQuery(delete_comments_query);

            let delete_message_query = Mysql.format(`DELETE FROM messages WHERE id = ? AND user_id = ?;`, Object.values(params));
            response_data = await this.executeQuery(delete_message_query);
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to delete a message.";
        }

        return response_data;
    }
}

module.exports = MessagesModel;