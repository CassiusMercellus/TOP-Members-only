const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.isMember = data.is_member;
    this.isAdmin = data.is_admin;
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new User(data) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      return data ? new User(data) : null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      if (!userData.password) {
        throw new Error('Password is required');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          password: hashedPassword,
          is_member: false,
          is_admin: userData.isAdmin || false
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating user:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to create user');
      }

      return new User(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(updates) {
    try {
      // First verify the user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', this.id)
        .single();

      if (checkError) {
        console.error('Error checking user existence:', checkError);
        throw new Error('User not found');
      }

      // Perform the update
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Failed to update user');
      }

      // Update the instance with new data
      Object.assign(this, data);
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User; 