class Users
{

    constructor ()
    {
        this.users = [];
    }

    addUser (id, nickname, room, language)
    {
        var user = {id, nickname, room, language};
        this.users.push(user);
        return user;
    }

    removeUser (id)
    {
        var user = this.getUser(id);

        if(user)
        {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser (id)
    {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList (room, language)
    {
        var users = this.users.filter((user) => user.room === room && user.language === language);
        return users;
    }

    getUserListRoom (room)
    {
        var users = this.users.filter((user) => user.room === room);
        return users;
    }
}

module.exports = {Users}