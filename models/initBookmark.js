exports.initBookmark = function (){
    const BookmarkRepository = require('./Repository.js');
    const Bookmark = require('./Bookmark');
    const bookmarkRepository = new BookmarkRepository("bookmark");
    bookmarkRepository.add(new Bookmark('jojo','jojo.com','comedie'));
    bookmarkRepository.add(new Bookmark('patryceroy','patryceroy.com','peroquet'));
    bookmarkRepository.add(new Bookmark('dofus','dofus.com','jeu')); 
    bookmarkRepository.add({
        Id : 0,
        Name: 'aleaupro',
        Url: 'aleaupro.com',
        Category: 'gym'
      });
      contactsRepository.add({
        Id : 0,
        Name: 'oval',
        Url: 'oval.com',
        Category: 'information'
    });
}