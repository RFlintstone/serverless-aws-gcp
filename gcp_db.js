// Dependencies
const {Datastore} = require('@google-cloud/datastore');
const deepAssign = require('deep-assign');

// Default variables
let returnMessage;
const doneMessage = "Executed function successfully";

// Creates a client
const datastore = new Datastore();

// Makes every entity an object so it can be called as a JSON    ||
function entity_to_obj(entity) {
    let oKey = entity.key;
    if (!oKey) {
        oKey = entity[datastore.KEY];
    }
    if (oKey.id) {
        entity.id = oKey.id;
    }
    if (oKey.name) {
        entity.id = oKey.name;
    }
    return entity;
}

// Create a timestamp                                                                                                  ||
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const d = new Date();
const Timestamp = d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
const TimestampString = Timestamp.toString(); // Make Timestamp a string so it can be used

// Export functions so it can be used in index.js (once required)
module.exports = {
    post: async function (KIND, body) {
        const name = body.id; // The name/ID for the new entity.
        const taskKey = datastore.key([KIND, name]); // The Cloud Datastore key for the new entity.
        const setData = {
            created_at: TimestampString,
            updated_at: "-"
        }
        const loadData = deepAssign(setData, body); // Merge setData and body so it can be called as one object
        const task = // Set (save) task with a task key and the merged data
            {
                key: taskKey,
                data: loadData
            };
        // Save data / task in DB
        await datastore.save(task, (err, entity) => { // Save merged data with appropriate task key
            if (err) {
                result = err;
            } else {
                result = task;
            }
        })
        return task;
    },
    get: async function (KIND) {
        // Init query
        const query = datastore.createQuery(KIND).order('created_at');
        // Set array variable equal to the (now) executing query so it can be called upon
        const [tasks] = await datastore.runQuery(query);
        // Create array and put all items which return from task in the 'allTask' array
        let allTasks = [];
        for (const task of tasks) {
            allTasks.push(entity_to_obj(task));
        }
        // If array is empty say that there doesn't exist data in the database else return all items
        if (allTasks.length === 0) {
            allTasks = [{"id": "-", "status": "No data"}];
        }
        return allTasks;
    },
    getSpecific: async function (KIND, itemID) {
        // Make query with filter
        const query = datastore.createQuery(KIND).filter('id', '=', itemID);
        // Set variable equal to the (now) executing query so it can be called upon
        const tasks = await datastore.runQuery(query);
        // Create array and put all items which return from task in the 'allTask' array
        let allTasks = [];
        for (const task of tasks[0]) {
            allTasks.push(entity_to_obj(task));
        }
        // If array is empty say that there doesn't exist data in the database else return all items
        if (allTasks.length === 0) {
            allTasks = [{"id":"-","status":"No data"}];
        }
        return allTasks;
    },
    put: async function (KIND, body) {
        // Get all required data from body
        const name = body.id;
        const whatToUpdate = body.paramName;
        const setValueUpdate = body.paramValue;

        // Create query with (appropriate) key
        const update = datastore.transaction();
        const taskKey = datastore.key([KIND, name]);
        // Try running query
        try {
            // Run update with required data
            await update.run();
            const [task] = await update.get(taskKey);
            // Set new values
            task['updated_at'] = TimestampString;
            task[whatToUpdate] = setValueUpdate;
            // Make save operation with new values
            update.save({
                key: taskKey,
                data: task,
            });
            // Submit and save new values in DB
            await update.commit();
            // Return new data
            return task;
        // Couldnt execute query? Then revert changes and return error message
        } catch (err) {
            update.rollback();
            return (`${err}, Make sure you use product ID to update an entry`);
        }
    },
    delete: async function (KIND, itemID) {
        const name = itemID; // The name/ID from the entity.
        const taskKey = datastore.key([KIND, name]); // The Cloud Datastore key for the removal of the entity.
        const task = await datastore.delete(taskKey); // Remove entry from DB
        return task; // Return query response
    }
}