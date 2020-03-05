// Aggregate db.stats for every DB in a MongoDB deployment
var totalIndexSize = 0;
var totalDataSize = 0;
var totalStorageSize = 0;
var totalDocuments = 0;
var reservedDBs = ["admin","config","local"];

// Switch to admin database and get list of databases.
db = db.getSiblingDB("admin");
dbs = db.runCommand({ "listDatabases": 1 }).databases;

// Iterate through each database and get its stats.
dbs.forEach(function(database) {
    if (reservedDBs.includes(database.name))
        return;
    db = db.getSiblingDB(database.name);
    print("Obtaining stats for " + database.name);

    var stats = db.stats(1024*1024*1024);
    totalIndexSize += stats.indexSize;
    totalDataSize += stats.dataSize;
    totalStorageSize += stats.storageSize;
    totalDocuments += stats.objects;
});

print ("Total data size in GB: " + totalDataSize.toFixed(2));
print ("Total index size in GB: " + totalIndexSize.toFixed(2));
print ("Total storage size in GB: " + totalStorageSize.toFixed(2));
print ("Total documents: " + totalDocuments.toFixed(0));