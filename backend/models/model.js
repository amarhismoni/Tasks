const Sequelize = require("sequelize");

const sequelize = new Sequelize("tasks", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});

const Users = sequelize.define("users", {
    fullname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    resetToken: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    resetTokenExpire: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
});

const Tasks = sequelize.define(
    "tasks",
    {
        taskId: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        taskDescription: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        taskDate: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: false,
        },
        taskTime: {
            type: Sequelize.DataTypes.TIME,
            allowNull: false,
        },
        taskStatus: {
            type: Sequelize.DataTypes.ENUM("Pending", "Done", "Archived"),
            defaultValue: "Pending",
        },
    },
    {
        tableName: "tasks",
        timestamps: false,
    }
);
Users.hasMany(Tasks, {
    foreignKey: "userId",
});

(async () => {
    await sequelize.sync({ force: false });
})();

module.exports = { Users, Tasks };
