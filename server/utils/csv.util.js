const fs = require('fs');
const path = require('path');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const deleteFileAfterDownloading = async (filePath, timeout) => {
    try {
        if (fs.existsSync(filePath)) {
            setTimeout(() => {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error("Error deleting file:", err);
                }
            }, timeout);
        }
    } catch (error) {
        console.error("Error checking file existence:", error);
    }
};

const createCSVFile = async (headers, list, fileNamePrefix = "data") => {
    const currentDate = moment().format("MM-DD-YYYY-hh-mm-ss");
    const fileName = `${fileNamePrefix}_${currentDate}.csv`;
    const filePath = path.join(__dirname, "..", "uploads", fileName);
    const parsedHeaders = headers.map(header => JSON.parse(header));

    const csvWriter = createCsvWriter({
        path: filePath,
        header: parsedHeaders,
    });

    const csvData = list.map((item) => {
        const formattedItem = {};
        parsedHeaders.forEach((column) => {
            const keys = column.id.split('.');
            let value = item;

            keys.forEach((key) => {
                if (value && typeof value === 'object' && key in value) {
                    if (typeof value[key] === 'object') {
                        value = Object.values(value[key]).join(' ').trim();
                        if (key === 'createdAt') {
                            value = moment(item[key]).format("YYYY-MM-DD hh:mm:ss");
                        }
                    } else {
                        value = value[key];
                    }
                } else {
                    value = "----";
                }
            });
            formattedItem[column.id] = value;
        });
        return formattedItem;
    });

    await csvWriter.writeRecords(csvData);
    deleteFileAfterDownloading(filePath, 10000);
    return filePath;
};

module.exports = { createCSVFile };
