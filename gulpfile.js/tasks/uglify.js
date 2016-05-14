"use strict";

var gulp = require("gulp");
var uglify = require("gulp-uglify");

gulp.task("uglify", function ()
{
    return gulp.src("src/memory-pool.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});