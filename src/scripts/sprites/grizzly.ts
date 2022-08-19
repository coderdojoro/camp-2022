import 'phaser';
import Hero from './hero';
import TelportScene from '../scenes/telportScene';
import { PhaserNavMesh } from 'phaser-navmesh';

enum State {
    IDLE,
    FOLLOW,
    FREEZE,
    DEAD
}

export default class Grizzly extends Phaser.GameObjects.Sprite {
    enemyState: State = State.IDLE;

    navMesh: PhaserNavMesh;

    target?: Phaser.Geom.Point;

    heroCollider: Phaser.Physics.Arcade.Collider;

    scene: TelportScene;

    debugCircles: Phaser.GameObjects.Arc[] = new Array();

    constructor(scene: TelportScene, x, y) {
        super(scene, x, y, 'grizzly-idle-spritesheet', 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setSize(20, 31);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(6, 1);

        this.anims.create({
            key: 'grizzly-idle-anim',
            frames: this.anims.generateFrameNumbers('grizzly-idle-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-n-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-n-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-s-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-s-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-e-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-e-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-die-anim',
            frames: this.anims.generateFrameNumbers('grizzly-die-spritesheet', {}),
            frameRate: 7,
            repeat: 0
        });

        this.heroCollider = this.scene.physics.world.addOverlap(
            this.scene.hero,
            this,
            () => {
                this.scene.hero.kill();
            },
            undefined,
            this
        );

        this.navMesh = this.scene.navMeshPlugin.buildMeshFromTilemap('mash', this.scene.map, [this.scene.worldLayer]);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.enemyState == State.DEAD || this.enemyState == State.FREEZE) {
            return;
        }

        if (this.enemyState == State.IDLE) {
            let distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.hero.x, this.scene.hero.y);
            if (distanceFromPlayer <= 300 && !this.target) {
                this.computeNextTarget();
            }
        }

        if (this.enemyState == State.FOLLOW && this.target) {
            this.computeNextTarget();
            if (this.target) {
                this.scene.physics.moveTo(this, this.target!.x, this.target!.y, 100);
            }
            this.setWalkAnimation();
        }

        if (this.enemyState == State.IDLE) {
            this.anims.play('grizzly-idle-anim', true);
        }
    }

    computeNextTarget() {
        let path: Phaser.Geom.Point[] = this.navMesh.findPath(
            {
                x: this.x,
                y: this.y
            },
            {
                x: this.scene.hero.x,
                y: this.scene.hero.y
            }
        );
        if (path == null) {
            this.enemyState = State.IDLE;
            this.target = undefined;
            return;
        }

        this.target = path[1];
        this.enemyState = State.FOLLOW;
    }

    setWalkAnimation() {
        // if (this.enemyState != State.FOLLOW) {
        //     return;
        // }
        let velocityRadiansAngle = (this.body as Phaser.Physics.Arcade.Body).velocity.angle();
        let velocityDegreeAngle = (velocityRadiansAngle * 180) / Math.PI;

        let direction: string = 'err';
        if (velocityDegreeAngle >= 315 || velocityDegreeAngle <= 45) {
            direction = 'e';
        }
        if (135 <= velocityDegreeAngle && velocityDegreeAngle <= 225) {
            direction = 'w';
        }
        if (45 < velocityDegreeAngle && velocityDegreeAngle < 135) {
            direction = 's';
        }
        if (225 < velocityDegreeAngle && velocityDegreeAngle < 315) {
            direction = 'n';
        }

        if (direction == 'e') {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }

        if (direction == 'e' || direction == 'w') {
            this.anims.play('grizzly-walk-e-anim', true);
        }
        if (direction == 's') {
            this.anims.play('grizzly-walk-s-anim', true);
        }
        if (direction == 'n') {
            this.anims.play('grizzly-walk-n-anim', true);
        }
    }

    freeze() {
        if (this.enemyState == State.DEAD) {
            return;
        }
        this.enemyState = State.FREEZE;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    }

    kill() {
        if (this.enemyState == State.DEAD) {
            return;
        }
        this.enemyState = State.DEAD;
        this.anims.play('grizzly-die-anim', true);
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        this.scene.physics.world.removeCollider(this.heroCollider);
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setActive(false);
        });
        this.scene.time.delayedCall(30 * 1000, () => this.destroy(), [], this);
    }
}
