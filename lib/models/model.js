class Model {
    constructor(schema) {
        this.schema = schema;
    }

    async create(data) {
        try{

            let record = new this.schema(data);
            return await record.save();
        }catch(e){
            console.error('Cannot create',e);
        }
    }

    async read(_id) {
        try {
            if (_id) {
              let record = await this.schema.findOne({_id});
              if(record) {
                  return await this.schema.find();
              }else{
                return {status: '404', message: "Not found"}
              }
            } else {
              let records = await this.schema.find();
              return records;
            }
          } catch(e) {
            return {status: 'Error', message: "Invalid ID"};
          }
    }

    async readByQuery(query) {
        try{

            let records = await this.schema.find(query);
            return records;
        }catch(e){
            console.error('Cannot read all users',e);
        }
    }

    async update(_id, data) {
        try{

            let updateInfo = await this.schema.updateOne({ _id }, data);
            if (updateInfo && updateInfo.nModified === 1) {
                let record = await this.read(_id);
                return record;
            }
        }catch(e){
            console.error('Cannot update',e);
        }
    }

    async delete(_id) {
        try {
            await this.schema.deleteOne({_id});
            return _id;
          } catch(e) {
            return {status: 'Error', message: 'Could not delete item'}
          }
        }
}

module.exports = Model;
