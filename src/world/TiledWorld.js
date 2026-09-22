export class TiledWorld {
  constructor(map){
    if(map.tilewidth!==16||map.tileheight!==16)throw Error('Unsupported tile size');
    this.width=map.width;this.height=map.height;
    const layer=n=>map.layers.find(x=>x.name===n&&x.type==='tilelayer');
    this.shore=layer('Shore')?.data;
    this.collision=layer('Collision')?.data;
    this.water=layer('Water')?.data;
    const n=this.width*this.height;
    if(!this.shore||!this.collision||!this.water||[this.shore,this.collision,this.water].some(x=>x.length!==n))throw Error('Malformed Tiled layers');
    this.spawn=map.layers.find(x=>x.name==='Entities')?.objects?.find(x=>x.type==='spawn');
    if(!this.spawn)throw Error('Missing spawn');
    const x=Math.floor(this.spawn.x/16),y=Math.floor(this.spawn.y/16);
    if(!this.isPassable(x,y))throw Error('Blocked spawn');
  }
  inBounds(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<this.width&&y<this.height;}
  isPassable(x,y){return this.inBounds(x,y)&&this.collision[y*this.width+x]===0;}
  tileAt(x,y){return this.inBounds(x,y)?this.water[y*this.width+x]:-1;}
  get spawnX(){return Math.floor(this.spawn.x/16);}
  get spawnY(){return Math.floor(this.spawn.y/16);}
}
