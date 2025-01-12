const SavedData = require('../models/Data');

const saveDrawnData = async (req, res, next) => {
    try {
        const { data, name, description } = req.body;
        const userId = req.user;

        const savedData = new SavedData({
            user: userId,
            data: data,
            name: name || "Untitled Data",
            description: description || "No description available",
        });

        await savedData.save();

        res.status(200).json({ status: "success", msg: "Data saved successfully." });
    } catch (err) {
        next(err);
    }
};

const getSavedData = async (req, res, next) => {
    try {
        const userId = req.user;

        const savedData = await SavedData.find({ user: userId }).sort({ createdAt: -1 });

        if (savedData.length === 0) {
            return res.status(404).json({ status: "failure", msg: "No saved data found." });
        }

        res.status(200).json({ status: "success", data: savedData });
    } catch (err) {
        next(err);
    }
};

const getSavedDataById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const savedData = await SavedData.findById(id);

        if (!savedData) {
            return res.status(404).json({ status: "failure", msg: "Saved data not found." });
        }

        res.status(200).json({ status: "success", data: savedData });
    } catch (err) {
        next(err);
    }
};

const deleteSavedData = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        const savedData = await SavedData.findOne({ _id: id, user: userId });

        if (!savedData) {
            return res.status(404).json({ status: "failure", msg: "Saved data not found or unauthorized." });
        }

        await SavedData.deleteOne({ _id: id });

        res.status(200).json({ status: "success", msg: "Saved data deleted successfully." });
    } catch (err) {
        next(err);
    }
};

module.exports = { saveDrawnData, getSavedData, getSavedDataById, deleteSavedData };
