class BaseService {

    constructor(repository){
        this.repository = repository;
    }

    create(data){
        return this.repository.create(data);
    }

    update(id,data){
        return this.repository.update(id,data);
    }

    delete(id){
        return this.repository.delete(id);
    }

    findAll(options){
        return this.repository.findAll(options);
    }

    findById(id){
        return this.repository.findById(id);
    }

}

module.exports = BaseService;