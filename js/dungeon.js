function Dungeon(world, width, height) {
    this.world = world;
    this.width = width;
    this.height = height;
    this.map = 0;
    this.doors = [];
    this.spawns = [];
    this.ok = 0;

    Dungeon.prototype.create = function() {
        this.initMap();
        this.createRooms();
        this.createRoads();
        var list;
        var max_count = 0;

        for(var x = 0; x < this.width ; x++) {
            for(var y = 0; y < this.height ; y++) {
                this.map2[x][y] = this.map[x][y];
            }
        }
        var world = {};
        while(!this.ok) {
            var start_y = 0;
            var start_x = 0;
            for(var x = 0; x < this.width; x++) {
                for( var y = 0; y < this.height; y++) {
                    if(this.map2[x][y] == 1 || this.map2[x][y] == 2) {
                        start_x = x;
                        start_y = y;
                        break;
                    }
                }
                if(start_x != 0) {
                    break;
                }
            }

            var res = this.floodFill(start_x,start_y);
            if(res.count == 1) {
                ok = 1;
            } else {
                world[res.count] = res.list;
            }
        }
        var largest = 0;
        for(var k in world) {
            if(k > largest) {
                largest = k;
            }
        }
        for(var k in world) {
            if(k == largest) {
                continue;
            }
            for(var l = 0; l < world[k].length; l++) {
                this.map[world[k][l][0]][world[k][l][1]] = 0;
                var i = 0;
                for(var d = 0; d < doors.length; d++) {
                    i++;
                    if(doors[d][0] == world[k][l][0] && doors[d][1] == world[k][l][1]) {
                        doors.splice(i, 1);
                    }
                }
            }
        }
        this.spawn();
    };

    Dungeon.prototype.initMap = function() {
        this.map = new Array(this.width);
        this.map2 = new Array(this.width);
        for(var x = 0; x < this.width; x++) {
            this.map[x] = new Array(this.height);
            this.map2[x] = new Array(this.height);
            for( var y = 0; y < this.height; y++) {
                this.map[x][y] = 0;
                this.map2[x][y] = 0;
            }
        }
    };

    Dungeon.prototype.createRooms = function() {
        for(var i = 0; i < 100; i++) {
            var rx = 50+(Math.random()*(width-50))|0;
            var ry = 50+(Math.random()*(height-50))|0;

            var size_w = 50+(Math.random()*50)|0;
            var size_h = 50+(Math.random()*50)|0;

            var free = 1;
            for(var x = rx - (size_w/1.1)|0; x < (rx + size_w/1.1)|0; x++) {
                for(var y = (ry - size_h/1.1)|0; y < (ry + size_h/1.1)|0; y++) {
                    if(x > 0 && x < width && y > 0 && y < height) {
                        if(this.map[x][y] == 1) {
                            free = 0;
                            break;
                        }
                    }
                }
                if(!free) { break; }
            }

            if(free) {
                for(var x = rx - (size_w/2)|0; x < (rx + size_w/2)|0; x++) {
                    for(var y = (ry - size_h/2)|0; y < (ry + size_h/2)|0; y++) {
                        if(x >= this.width || y >= this.height) {
                            continue;
                        }
                        if(this.map[x] == undefined) {
                            console.log("X:",x, y);
                        } else if(this.map[x][y] == undefined) {
                            console.log("XX:",x, y);
                        }
                        this.map[x][y] = 1;
                        if(x == rx && y == ry) {
                            this.spawns.push([x,y]);
                        }
                        if(x == rx && y == (ry-size_h/2)|0 ) {
                            this.map[x][y] = 2;
                            this.doors.push([x, y]);
                        }
                        if(x == rx && y == (ry+size_h/2-1)|0 ) {
                            this.map[x][y] = 2;
                            this.doors.push([x, y]);
                        }
                        if(y == ry && x == rx-(size_w/2)|0) {
                            this.map[x][y] = 2;
                            this.doors.push([x, y]);
                        }
                        if(y == ry && x == rx+(size_w/2-1)|0) {
                            this.map[x][y] = 2;
                            this.doors.push([x, y]);
                        }
                    }
                }
            }
        }
    };

    Dungeon.prototype.createRoads = function() {
        var roadSize = 10;
        for(var p = 0; p < this.doors.length; p++) {
            var count = 1;
            var list = [];
            var roadFail = 0;
            while(this.map[this.doors[p][0]+count][this.doors[p][1]] == 0 && this.doors[p][0]+count > 1 && this.doors[p][0]+count < this.width - 1) {
                for(var yy = this.doors[p][1]-roadSize/2; yy < this.doors[p][1]+roadSize/2; yy++) {
                    if(yy > 1 && yy < this.height) {
                        if(this.map[this.doors[p][0]+count][yy] == 1 || this.map[this.doors[p][0]+count][yy] == 2) {
                            roadFail = 1;
                            break;
                        }
                    }
                }
                if(roadFail) {
                    break;
                }
                list.push([this.doors[p][0]+count, this.doors[p][1]]);
                count++;
            }
            if(!roadFail) {
                for(var yy = this.doors[p][1]-roadSize/2; yy < this.doors[p][1]+roadSize/2; yy++) {
                    if(yy > 1 && yy < this.height) {
                        if(this.map[this.doors[p][0]+count][yy] == 0) {
                            roadFail = 1;
                            break;
                        }
                    }
                }
                if(!roadFail) {
                    for(var i = 0; i < list.length; i++) {
                        if(list[i][0]) {
                            for(var yy = list[i][1]-roadSize/2; yy < list[i][1]+roadSize/2; yy++) {
                                this.map[list[i][0]][yy] = 2;
                            }
                        }
                    }
                }
            }

            count = 1;
            list = [];
            roadFail = 0;
            while(this.map[this.doors[p][0]][this.doors[p][1]+count] == 0 && this.doors[p][1]+count > 1 && this.doors[p][1]+count < this.height- 1) {
                for(var xx = this.doors[p][0]-roadSize/2; xx < this.doors[p][0]+roadSize/2; xx++) {
                    if(xx > 1 && xx < this.width) {
                        if(this.map[xx][this.doors[p][1]+count] == 1 || this.map[xx][this.doors[p][1]+count] == 2) {
                            roadFail = 1;
                            break;
                        }
                    }
                }
                if(roadFail) {
                    break;
                }
                list.push([this.doors[p][0], this.doors[p][1]+count]);
                count++;
            }
            if(!roadFail) {
                for(var xx = this.doors[p][0]-roadSize/2; xx < this.doors[p][0]+roadSize/2; xx++) {
                    if(xx > 1 && xx < this.width) {
                        if(this.map[xx][this.doors[p][1]+count] == 0) {
                            roadFail = 1;
                            break;
                        }
                    }
                }
                if(!roadFail) {
                    for(var i = 0; i < list.length; i++) {
                        if(list[i][0]) {
                            for(var xx = list[i][0]-roadSize/2; xx < list[i][0]+roadSize/2; xx++) {
                               this.map[xx][list[i][1]] = 2;
                            }
                        }
                    }
                }
            }
        }
        for(var d = 0; d < this.doors.length; d++) {
           this.map[this.doors[d][0]][this.doors[d][1]] = 1;
        }
    };

    Dungeon.prototype.floodFill = function(start_x, start_y) {
        var stack = [];
        stack.push([start_x,start_y]);

        var p;
        var count = 0;
        var list = [];
        while(stack.length > -1) {
            p = stack.pop();
            if(p == undefined) {
                break;
            }
            list.push(p);
            count++;
            if(this.map2[p[0]][p[1]] == 1 || this.map2[p[0]][p[1]] == 2) {
                this.map2[p[0]][p[1]] = 3;
                if(p[0]+1 > 0 && p[0]+1 < width) {
                    stack.push([p[0]+1, p[1]]);
                }
                if(p[0]-1 > 0 && p[0]-1 < width) {
                    stack.push([p[0]-1, p[1]]);
                }
                if(p[1]-1 > 0 && p[1]-1 < height) {
                    stack.push([p[0], p[1]-1]);
                }
                if(p[1]+1 > 0 && p[1]+1 < height) {
                    stack.push([p[0], p[1]+1]);
                }
            }
        }

        return {list: list, count: count, status: 1};
    };

    Dungeon.prototype.spawn = function() {
        var max_dist = 0;
        var player;
        var portal;
        for(var p = 0; p < this.spawns.length; p++) {
            for(var p2 = 0; p2 < this.spawns.length; p2++) {
                var dist = sqrt((Math.pow(this.spawns[p2][0]-this.spawns[p][0]))+(Math.pow(this.spawns[p2][1]-this.spawns[p][1])));
                if(dist > max_dist) {
                    max_dist = dist;
                    player = [this.spawns[p][0], this.spawns[p][1]];
                    portal = [this.spawns[p2][0], this.spawns[p2][1]];
                }
            }
        }
        this.map[player[0]][player[1]] = 5;
        this.map[portal[0]][portal[1]] = 6;
    };

};
