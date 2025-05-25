const supabase = require('../config/supabase');

class Message {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.text = data.text;
    this.userId = data.user_id;
    this.createdAt = data.created_at;
    this.user = data.user;
  }

  static async findAll() {
    try {
      // First get all messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Then get all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, username');

      if (usersError) throw usersError;

      // Create a map of user IDs to usernames
      const userMap = users.reduce((map, user) => {
        map[user.id] = user;
        return map;
      }, {});

      // Combine the data
      return messages.map(message => new Message({
        ...message,
        user: userMap[message.user_id]
      }));
    } catch (error) {
      console.error('Error finding messages:', error);
      throw error;
    }
  }

  static async create(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          title: messageData.title,
          text: messageData.text,
          user_id: messageData.userId
        }])
        .select()
        .single();

      if (error) throw error;
      return new Message(data);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('Starting delete operation for message:', id);
      
      // First check if the message exists
      const { data: message, error: checkError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('Error checking message:', checkError);
        throw new Error('Message not found');
      }

      console.log('Found message to delete:', message);

      // Perform the delete with explicit return
      const { data, error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
        .select();

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        throw new Error(`Failed to delete message: ${deleteError.message}`);
      }

      console.log('Delete response:', data);

      // Verify deletion
      const { data: verifyData, error: verifyError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id);

      if (verifyError) {
        console.error('Error verifying deletion:', verifyError);
      }

      if (verifyData && verifyData.length > 0) {
        console.error('Message still exists after deletion:', verifyData);
        throw new Error('Message was not deleted');
      }

      console.log('Delete operation completed successfully');
      return true;
    } catch (error) {
      console.error('Error in delete operation:', error);
      throw error;
    }
  }
}

module.exports = Message; 