const { body, validationResult } = require("express-validator");
const Genre = require("../models/genre");
const async = require("async");
const Book = require("../models/book");

// Display list of all Genre.
exports.genre_list = (req, res) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_genres) {
      if (err) {
        next(err);
      }
      res.render("genre_list", {
        title: "List of Genres",
        genre_list: list_genres,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genres_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        res.redirect("/catalog/genres");
      }
      res.render("genre_detail", {
        title: results.genre.name,
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }

            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre === null) {
        res.redirect("/catalog/genres");
      }
      console.log(results.genre_books);
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
