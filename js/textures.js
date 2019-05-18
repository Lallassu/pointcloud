const FLOOR1 = 0;
const WALL1 = 1;
const MAP1 = 2;
const ROOF1 = 3;
const CRATE1 = 4;


function Textures() {
    this.files = ["floor1.png", "wall2.png", "map1.png", "roof1.png", "crate.png"];
    this.tex = [];
    this.loaded = 0;

    Textures.prototype.clean = function() {
        for(var i = 0; i < this.tex.length; i++) {
            this.tex[i].map = null;
            this.tex[i] = null;
        }
    };

    Textures.prototype.getMap = function(map_id) {
        return this.tex[map_id];
    };

    Textures.prototype.isLoaded = function() {
        return this.loaded == this.files.length? true : false;
    };

    Textures.prototype.prepare = function() {
        for(var i = 0; i < this.files.length; i++) {
            this.tex[i] = {};
            this.tex[i].file = this.files[i];
            this.load(this.tex[i].file, i);
        }
    };

    Textures.prototype.getPixel = function(x, y, tex_id) {
        // Scale x,y to image size.
        //console.log(this.tex[tex_id], tex_id);
        var tx = (x/this.tex[tex_id].height)|0; 
        var xx = x - (tx*this.tex[tex_id].height);
        var ty = (y/this.tex[tex_id].width)|0; 
        var yy = y - (ty*this.tex[tex_id].width);
        //console.log(yy,xx);
        if(this.tex[tex_id].map[xx] == undefined) {
            console.log(xx,yy);
        }
        if(xx >= this.tex[tex_id].height) { xx = this.tex[tex_id].height - 10;}
        if(yy >= this.tex[tex_id].width) { yy = this.tex[tex_id].width - 10;}
        if(this.tex[tex_id].map[xx] == undefined) {
            console.log(this.tex[tex_id].map.length);
            console.log(this.tex[tex_id], xx,yy);
        }
        return {r: this.tex[tex_id].map[xx][yy].r,
            g: this.tex[tex_id].map[xx][yy].g,
            b: this.tex[tex_id].map[xx][yy].b
        };
    };

    Textures.prototype.load = function(filename, id) {
        var image = new Image();
        image.src = "assets/textures/"+filename;
        image.id = id;
        var ctx = document.createElement('canvas').getContext('2d');
        var that = this;
        image.onload = function() {
            ctx.canvas.width  = image.width;
            ctx.canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            that.tex[image.id].width = image.width;
            that.tex[image.id].height = image.height;
            that.tex[image.id].map = new Array();
            var imgData = ctx.getImageData(0, 0, image.width, image.height);
            for(var y = 0; y < image.height; y++) {
                var pos = y * image.width * 4;
                that.tex[image.id].map[y] = new Array();
                for(var x = 0; x < image.width; x++) {
                    var r = imgData.data[pos++];
                    var g = imgData.data[pos++];
                    var b = imgData.data[pos++];
                    var a = imgData.data[pos++];
                    that.tex[image.id].map[y][x] = {'r': r, 'g': g, 'b': b, 'a': a};
                }
            }
            that.loaded++;
        }
    };

}
