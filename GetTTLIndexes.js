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

    print ("============================================");
    print("["+database.name+"] DB");
    print ("============================================");

    db.getCollectionNames().forEach(function(collname) {
        var coll= db.getCollection(collname);
        var stats = coll.stats(1024*1024);
        print ();
        print("["+stats.ns+"] Coll");
        print ("---------------------------------------");
        print ("data size in MB: " + stats.size.toFixed(2));
        print ("index size in MB: " + stats.totalIndexSize.toFixed(2));
        print ("storage size in MB: " + stats.storageSize.toFixed(2));
        print ("documents: " + stats.count.toFixed(0));
        print ();

        coll.getIndexes().forEach(function(ix) {
            if (ix.hasOwnProperty('expireAfterSeconds')) {
                print("TTL INDEX: " + ix.name);
                print("expireAfterSeconds: " + ix.expireAfterSeconds);
            }
        });
    });
});
