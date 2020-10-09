
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        objectsName = objectsName.toLowerCase();
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    get(id){
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }

    getNom(nom){
        for(let object of this.objectsList){
            if (object.Name === nom) {
               return object;
            }
        }
        return null;
    }

    getCategory(category){
        let allCategory = [];
        for(let object of this.objectsList){
            if (object.Category === category) {
               allCategory.push(object);
            }
        }
        return allCategory;
    }

    getFirstLetter(nom){
        var tableInsertion = [];
        tableInsertion = nom.split('');
        var returnTable = [];
        for(let object of this.objectsList){
            var nomTable = [];
            nomTable = object.Name.split('');
            let previous = true;
            let idpre = 0;
            for(let i = 0; i < tableInsertion.length - 1; ++i)
            {
                if(nomTable[i] === tableInsertion[i])
                {
                    if(previous && object.Id != idpre)
                    {
                    idpre = object.Id;
                    returnTable.push(object);
                }
                }
                else{
                    previous = false;
                }
            }
        }
        return returnTable;
            
    }

    getSortName() {
        return this.objectsList.sort((a, b) => a.Name.localeCompare(b.Name));
    }

    getSortCategory(){
        return this.objectsList.sort((a, b) => a.Category.localeCompare(b.Category));
    }

    remove(id) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    update(objectToModify) {
        let index = 0;
        console.log(objectToModify)
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    } 
    findByField(fieldName, value){
        let index = 0;
        for(let object of this.objectsList){
            try {
                if (object[fieldName] === value) {
                    return this.objectsList[index];
                }
                index ++;
            } catch(error) {
                break;
            }
        }
        return null;
    }
}