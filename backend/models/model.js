const Sequelize = require("sequelize");

const sequelize = new Sequelize("tasks", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});

const Users = sequelize.define("users", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    fullname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
});

const Tasks = sequelize.define("tasks", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    taskName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    taskDescription: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        reference: {

        }
    },
    isArchived: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
});

const Categories = sequelize.define("categories", {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    categorieName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
});

Categories.belongsToMany(Tasks, { through: "categoryTasks" });
Users.hasMany(Tasks, {
    foreignKey: 'userId'
});

(async () => {
    await sequelize.sync({ force: false });
})();

//User, Tasks, Categories, TasksCategory

module.exports = {Users, Tasks, Categories}
