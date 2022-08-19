import { Scene } from 'phaser';
import Hero from '../sprites/hero2';
import { PhaserNavMeshPlugin } from 'phaser-navmesh';

export default class TelportScene extends Scene {
    hero: Hero;
    teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject>;
    map: Phaser.Tilemaps.Tilemap;
    worldLayer: Phaser.Tilemaps.TilemapLayer;
    navMeshPlugin: PhaserNavMeshPlugin;
}
