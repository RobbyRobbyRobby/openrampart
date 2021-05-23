namespace SpriteKind {
    export const Neutral = SpriteKind.create()
}
function LevelStart () {
    info.startCountdown(60)
    game.showLongText("Prepare to defend yourself!", DialogLayout.Center)
}
sprites.onCreated(SpriteKind.Enemy, function (sprite) {
    sprite.setStayInScreen(true)
    tiles.placeOnRandomTile(sprite, assets.tile`EnemyStartOceanTile`)
    sprite.follow(mySprite, EnemyBaseSpeed)
})
function LoadNeutralSprites () {
	
}
function InitLevels () {
    Levels = []
    CurrentLevelIndex = 0
}
function CheckProjectiles () {
    for (let projectileElement of Projectiles) {
        if (Math.min(projectileElement.x, projectileElement.y) < 0) {
            Projectiles.removeAt(Projectiles.indexOf(projectileElement))
            projectileElement.destroy()
            if (EnemySprites.length <= 0) {
                LevelWon()
            }
        } else {
            if (Math.round(projectileElement.x) < Math.round(sprites.readDataNumber(projectileElement, "DestinationX")) && Math.round(projectileElement.y) < Math.round(sprites.readDataNumber(projectileElement, "DestinationY"))) {
                for (let value of EnemySprites) {
                    if (projectileElement.overlapsWith(value)) {
                        music.bigCrash.play()
                        value.destroy(effects.fire, 500)
                        EnemySprites.removeAt(EnemySprites.indexOf(value))
                        break;
                    }
                }
                Projectiles.removeAt(Projectiles.indexOf(projectileElement))
                projectileElement.destroy(effects.bubbles, 200)
            }
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Shoot()
})
function LoadLevel () {
    scene.setBackgroundColor(8)
    tiles.setTilemap(tilemap`level1`)
    mySprite.setPosition(152, 112)
    Cursor.setPosition(144, 104)
    info.setLife(3)
    LoadEnemySprites()
    LoadNeutralSprites()
    LevelStart()
}
function LoadEnemySprites () {
    for (let index = 0; index <= 4; index++) {
        EnemySprites.push(sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . e 2 2 . . . . . 
            . . . . . . . . e . 2 2 . . . . 
            . . . . . . . . e . 2 2 . . . . 
            . . . . . . . . e . 2 2 . . . . 
            . . . . . . . . e . 2 2 . . . . 
            . . . . . . . . e . 2 2 . . . . 
            . . . . . . . . e 2 2 . . . . . 
            . . . . . . . . e 2 . . . . . . 
            . . . . . . . . e . . . . . . . 
            . e e e e e e e e e e e e e e e 
            . e 4 4 4 4 4 4 4 4 4 4 4 4 e 1 
            . e e 4 4 4 4 4 4 4 4 4 4 e 9 . 
            . e e e e e e e e e e e e . 1 9 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Enemy))
    }
}
info.onCountdownEnd(function () {
    LevelWon()
})
function Shoot () {
    if (MaxActiveProjectiles > Projectiles.length) {
        ProjectileDestinationX = Cursor.x
        ProjectileDestinationY = Cursor.y
        if (mySprite.x - ProjectileDestinationX < mySprite.y - ProjectileDestinationY) {
            ProjectileVelocityX = (mySprite.x - ProjectileDestinationX) / (mySprite.y - ProjectileDestinationY) * ProjectileBaseSpeed
            ProjectileVelocityY = ProjectileBaseSpeed
        } else {
            ProjectileVelocityX = ProjectileBaseSpeed
            ProjectileVelocityY = (mySprite.y - ProjectileDestinationY) / (mySprite.x - ProjectileDestinationX) * ProjectileBaseSpeed
        }
        newProjectile = sprites.createProjectileFromSprite(assets.image`Cannonball`, mySprite, ProjectileVelocityX, ProjectileVelocityY)
        sprites.setDataNumber(newProjectile, "DestinationX", ProjectileDestinationX)
        sprites.setDataNumber(newProjectile, "DestinationY", ProjectileDestinationY)
        Projectiles.push(newProjectile)
        music.pewPew.play()
    }
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    sprite.destroy(effects.fire, 500)
    music.wawawawaa.play()
})
scene.onOverlapTile(SpriteKind.Enemy, sprites.castle.tilePath5, function (sprite, location) {
    sprite.setImage(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . f f f . . . 
        . . . . . . . f . . f 1 f . . f 
        . . . . . . . . f . f f f . f . 
        . . . f f f . . . f 1 f 1 f . . 
        f . . f 1 f . . f . f f f . . . 
        . f . f f f . f . . 1 f 1 . . . 
        . . f 1 f 1 f . . . 1 f 1 . . . 
        . . . f f f . . . . 1 f 1 . . . 
        . . . 1 f 1 . . . . f . f . . . 
        . . . 1 f 1 . . . f . . . f . . 
        . . . 1 f 1 . . f . . . . . f . 
        . . . f . f . . . . . . . . . . 
        . . f . . . f . . . . . . . . . 
        . f . . . . . f . . . . . . . . 
        `)
    music.footstep.play()
    sprite.startEffect(effects.trail, 500)
})
info.onLifeZero(function () {
    InitGame()
})
function InitPlayerSprite () {
    info.setScore(0)
    controller.moveSprite(Cursor, 100, 100)
    Cursor.setStayInScreen(true)
}
function InitGame () {
    InitSpriteVariables()
    InitLevels()
    LoadLevel()
}
function InitSpriteVariables () {
    SpriteTemplates = []
    EnemySprites = sprites.allOfKind(SpriteKind.Enemy)
    NeutralSprites = sprites.allOfKind(SpriteKind.Neutral)
    Projectiles = []
    mySprite = sprites.create(assets.image`Base`, SpriteKind.Player)
    Cursor = sprites.create(assets.image`Crosshair`, SpriteKind.Neutral)
    ProjectileBaseSpeed = -25
    MaxActiveProjectiles = 3
    EnemyBaseSpeed = 2
    InitPlayerSprite()
}
function LevelWon () {
    CurrentLevelIndex += 1
    LoadLevel()
}
let NeutralSprites: Sprite[] = []
let SpriteTemplates: number[] = []
let newProjectile: Sprite = null
let ProjectileVelocityY = 0
let ProjectileBaseSpeed = 0
let ProjectileVelocityX = 0
let ProjectileDestinationY = 0
let ProjectileDestinationX = 0
let MaxActiveProjectiles = 0
let Cursor: Sprite = null
let EnemySprites: Sprite[] = []
let Projectiles: Sprite[] = []
let CurrentLevelIndex = 0
let Levels: number[] = []
let EnemyBaseSpeed = 0
let mySprite: Sprite = null
InitGame()
game.onUpdateInterval(200, function () {
    CheckProjectiles()
})
