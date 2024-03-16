
module.exports = (sequelize, Sequelize) => {
    
    const Report = sequelize.define("Reports", {
        result: {
            type: Sequelize.STRING
        },
        image_path: {
            type: Sequelize.STRING
        },
        pdf_path: {
            type: Sequelize.STRING
        },
        cropId: {
            type: Sequelize.INTEGER,
            references: {
                model: "Crops",
                key: "id"

            }
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: "Users",
                key: "id"

            }
        },

    });

    return Report
}