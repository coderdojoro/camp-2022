import { Scene } from 'phaser';
import Hero from '../sprites/hero';

export default class TelportScene extends Scene {
    hero: Hero;
    teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject>;
    map: Phaser.Tilemaps.Tilemap;
    worldLayer: Phaser.Tilemaps.TilemapLayer;
}
