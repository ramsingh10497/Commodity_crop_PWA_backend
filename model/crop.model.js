
module.exports = (sequelize, Sequelize) => {
    const Crop = sequelize.define("Crops", {
        name: {
            type: Sequelize.STRING,
        }
    });
    
    return Crop
}