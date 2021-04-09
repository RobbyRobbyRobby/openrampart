function LevelStart () {
    info.startCountdown(60)
    game.showLongText("Prepare to defend yourself!", DialogLayout.Center)
}
function LoadNeutralSprites () {
	
}
function InitLevels () {
    Levels = []
    CurrentLevelIndex = 0
}
function CheckProjectiles () {
    for (let projectileElement of Projectiles) {
        if (Math.round(projectileElement.x) == Math.round(sprites.readDataNumber(projectileElement, "DestinationX")) && Math.round(projectileElement.y) == Math.round(sprites.readDataNumber(projectileElement, "DestinationY"))) {
            for (let enemySpriteElement of EnemySprites) {
                if (Math.round(projectileElement.x) == Math.round(enemySpriteElement.x) && Math.round(projectileElement.y) == Math.round(enemySpriteElement.y)) {
                    music.bigCrash.play()
                    enemySpriteElement.destroy(effects.fire, 500)
                    EnemySprites.removeAt(EnemySprites.indexOf(enemySpriteElement))
                }
            }
            projectileElement.setVelocity(0, 0)
            projectileElement.destroy(effects.bubbles, 200)
            music.thump.play()
            Projectiles.removeAt(Projectiles.indexOf(projectileElement))
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Shoot()
})
function LoadLevel () {
    LoadEnemySprites()
    LoadNeutralSprites()
    scene.setBackgroundColor(8)
    tiles.setTilemap(tilemap`level1`)
    mySprite.setPosition(152, 112)
    Cursor.setPosition(144, 104)
    info.setLife(3)
    LevelStart()
}
function LoadEnemySprites () {
    for (let index = 0; index <= 4; index++) {
        newEnemy = sprites.create(img`
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
            `, SpriteKind.Enemy)
        newEnemy.follow(mySprite, EnemyBaseSpeed)
        tiles.placeOnRandomTile(newEnemy, assets.tile`myTile`)
        EnemySprites.push(newEnemy)
    }
}
info.onCountdownEnd(function () {
	
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
info.onLifeZero(function () {
	
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
function MoveEnemySprites () {
    for (let enemySpriteElement of EnemySprites) {
    	
    }
}
function InitSpriteVariables () {
    SpriteTemplates = []
    EnemySprites = []
    NeutralSprites = []
    Projectiles = []
    mySprite = sprites.create(assets.image`Base`, SpriteKind.Player)
    Cursor = sprites.create(assets.image`Crosshair`, SpriteKind.Player)
    ProjectileBaseSpeed = -25
    MaxActiveProjectiles = 3
    EnemyBaseSpeed = 1
    InitPlayerSprite()
}
let NeutralSprites: number[] = []
let SpriteTemplates: number[] = []
let newProjectile: Sprite = null
let ProjectileVelocityY = 0
let ProjectileBaseSpeed = 0
let ProjectileVelocityX = 0
let ProjectileDestinationY = 0
let ProjectileDestinationX = 0
let MaxActiveProjectiles = 0
let EnemyBaseSpeed = 0
let newEnemy: Sprite = null
let Cursor: Sprite = null
let mySprite: Sprite = null
let EnemySprites: Sprite[] = []
let Projectiles: Sprite[] = []
let CurrentLevelIndex = 0
let Levels: number[] = []
InitGame()
game.onUpdate(function () {
    CheckProjectiles()
    MoveEnemySprites()
})
