"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var _1 = require(".");
var postHide;
(function (postHide) {
    postHide["hide"] = "1";
    postHide["show"] = "0";
})(postHide = exports.postHide || (exports.postHide = {}));
//TODO: 增加各种时间戳
var Post = /** @class */ (function (_super) {
    __extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Post.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Post.prototype, "title");
    __decorate([
        typeorm_1.Column()
    ], Post.prototype, "tags");
    __decorate([
        typeorm_1.Column()
    ], Post.prototype, "hide");
    __decorate([
        typeorm_1.Column('longtext')
    ], Post.prototype, "content");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return _1.UserModel; }, function (user) { return user.posts; })
    ], Post.prototype, "uid");
    Post = __decorate([
        typeorm_1.Entity({ name: 'post' })
    ], Post);
    return Post;
}(typeorm_1.BaseEntity));
exports["default"] = Post;
