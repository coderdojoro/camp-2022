import { Scene } from 'phaser';
import Hero2 from '../sprites/hero';
import { PhaserNavMeshPlugin } from 'phaser-navmesh';
import Hero1 from '../sprites/hero1';

export default class TelportScene extends Scene {
    hero: Hero1 ;
    teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject>;
    map: Phaser.Tilemaps.Tilemap;
    worldLayer: Phaser.Tilemaps.TilemapLayer;
    navMeshPlugin: PhaserNavMeshPlugin;
}
