const codes = require('../constants/responseCodes');
const messages = require('../constants/responseMessages');

exports.getRecords = async function (req, res) {
    const validation = (startDate, endDate, minCount, maxCount) => {
        switch (true) {
            case minCount > maxCount: return messages.COUNT_ERROR
            case new Date(startDate) > new Date(endDate): return messages.DATE_ERROR
            default: return false;
        }
    }

    const db = req.db;
    const { startDate, endDate, minCount, maxCount } = req.body;

    const valErr = validation(startDate, endDate, minCount, maxCount);
    if (valErr) {
        const response = {
            msg: valErr,
            code: codes.CLIENT_ERROR,
            records: []
        }
        res.status(400);
        res.send(response);
        return;
    }

    try {
        const collection = db.collection('records');
        const records = await collection.aggregate([
            { "$unwind": "$counts" },
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                },
            },
            {
                $group:
                {
                    _id: "$_id",
                    totalCount: {
                        $sum: "$counts"
                    },
                    key: { $first: "$_id" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            {
                $match: {
                    totalCount: {
                        $gte: minCount,
                        $lte: maxCount
                    }
                },
            }
        ]).toArray();

        const response = {
            msg: messages.SUCCESS,
            code: codes.OK,
            records
        }
        res.send(response);
    } catch (e) {
        const response = {
            msg: messages.ERROR,
            code: codes.SERVER_ERROR,
            records: []
        }
        res.status(500);
        res.send(response);
    }
};