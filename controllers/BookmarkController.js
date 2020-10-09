const Repository = require('../models/Repository');

module.exports = 
class BookmarkController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.bookmarkRepository = new Repository('Bookmark');
    }

    get(id){
        if(!isNaN(id))
            this.response.JSON(this.bookmarkRepository.get(id));
        else
            this.response.JSON(this.bookmarkRepository.getAll());
    }
    
    queryStringHelp() {
        
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(this.queryStringParamsList());
    }

    invalidUrl(){
        var response = [
            {
              "message": "Endpoint incorrect. Les options possibles sont "
            }
          ]
          this.res.statusCode = 404;
          this.res.setHeader('content-Type', 'Application/json');
          this.res.end(this.queryStringParamsList());
          this.res.end(JSON.stringify(response));
    }

    queryStringParamsList() {
        // expose all the possible query strings
        let content = "<div style=font-family:arial>";
        content += "<h4>List of possible parameters in query strings:</h4>";
        content += "<h4> /api/bookmark : Obtenir la liste des signets en ordre croissant d’Id </h4>";
        content += "<h4> /api/bookmark?sort='name' : Obtenir la liste des signets en ordre croissant de nom </h4>";
        content += "<h4> /api/bookmark?sort='category' : Obtenir la liste des signets en ordre croissant de catégorie </h4>";
        content += "<h4> /api/bookmark/id : Obtenir le signet ayant le Id de valeur id </h4>";
        content += "<h4> /api/bookmark?name='nom' : Obtenir le signet ayant le Name de valeur nom </h4>";
        content += "<h4> /api/bookmark?name='ab*' : Obtenir la liste des signets dont la valeur du champ Name commence par le préfixe ab (évidemment, ab n’est qu’un exemple, et tout préfixe non-vide serait valide) </h4>";
        content += "<h4> /api/bookmark?category='sport' : Obtenir la liste des signets ayant un Category de valeur sport </h4>";
        content += "<h4> /api/bookmark? : Obtenir la liste des paramètres supportés pour une requête portant sur un seul signet (celles dont l’URL débute par /api/bookmark)</h4>";
        content += "<h4> /api/bookmark : Ajouter un signet aux signets existants (note : vous devez valider le signet avant de l’ajouter)</h4>";
        content += "<h4> /api/bookmark/id : Modifier le signet ayant un Id de valeur id (note : vous devez valider la nouvelle valeur du signet avant de procéder à la modification) </h4>";
        content += "<h4> /api/bookmark/id : Effacer le signet ayant un Id de valeur id </h4>";
        
        content += "</div>";
        return content;
    }

    checkParams(params){
        if ('sort' in params) {
            if(params.sort == 'name')
            {
                return true;
            }
            else if(params.sort == 'category')
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else if('name' in params)
        {
            return true;
        }
        else if('url' in params)
        {
            return true;
        }
        else if('category' in params)
        {
            return true;
        }
        else{
            return false;
        }
    }
    get(){
        let params = this.getQueryStringParams();
        // if we have no parameter, expose the list of possible query strings
        if (params === null) {
            this.response.JSON(this.bookmarkRepository.getAll());
        }
        else if (Object.keys(params).length === 0) {
            this.queryStringHelp();
        }
        else {
            if(this.checkParams(params))
                this.doSort(params);
            else
            this.invalidUrl();
        }
    }

    doSort(params){
        let bookmarkRepository = new Repository('Bookmark');
        if(params.sort)
        {
            switch(params.sort){
                case 'name':
                    bookmarkRepository = this.bookmarkRepository.getSortName();
                    break;
                case 'category':
                    bookmarkRepository = this.bookmarkRepository.getSortCategory();
                    break;
            }
        }
        if(params.name)
        {
            if(params.name.includes("*")){
                bookmarkRepository = this.bookmarkRepository.getFirstLetter(params.name);
            }
            else{
                bookmarkRepository = this.bookmarkRepository.getNom(params.name);
            }
        }
        if(params.category){
            bookmarkRepository = this.bookmarkRepository.getCategory(params.category);
        }
            this.response.JSON(bookmarkRepository);
    }

    post(bookmarkObj){  
        let newBookmark
        newBookmark = this.bookmarkRepository.add(bookmarkObj);

        if (newBookmark)
            this.response.created(newBookmark);
        else
            this.response.internalError();
    }

    remove(id){
        if (this.bookmarkRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }

    put(id){
        // todo : validate contact before updating
        if (this.bookmarkRepository.update(id))
            this.response.ok();
        else 
            this.response.notFound();
    } 
}
