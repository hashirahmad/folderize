const arg = require("yargs").argv
const fs = require('fs')
const path = require('path')
const mv = require('mv')
const cliProgress = require("cli-progress")
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
const prompt = require('prompt')

cli()

function sleep(sec) {
    return new Promise( res => {

        progressBar.start(sec, 0)
        let progressValue = 0
        let incrementer = setInterval(() => {
            progressBar.update( ++progressValue )
        }, 1000)

        setTimeout( () => {
            clearInterval(incrementer)
            progressBar.stop()
            res()
        }, sec * 1000 );

    })
}

function mkdir( dir ) {

    if ( fs.existsSync( dir ) === false ) {

        fs.mkdirSync( dir )
        console.log('Folder created:', dir)

    }

}

async function moveEachFileInOwnFolder(dir, obj){

    let folderAcronym = nameToAcronym(obj.name)
    await renameFiles(dir, folderAcronym)

}

function nameToAcronym(name) {
    
    let acronym = ''
    let splittedName = name.split(' ')
    if (splittedName.length > 1) {

        for ( let w in splittedName ) {
            
            acronym += splittedName[w][0]
            
        }
    } else {

        acronym = name.substring(0,3)

    }
    return acronym
    
}

async function renameFiles(dir, acronym) {

    console.log('Renaming files with Folder acronym so it is easier to find . . . \n', dir)
    try {

        let files = fs.readdirSync(dir)
        console.log('Files are:', JSON.stringify(files, null, 4))
        for (let f in files) {

            if (files[f].endsWith('.mp3') && files[f].startsWith(`${acronym}`) === false) {

                let filePath = path.join(dir, files[f])

                let acronimedName = acronym + ' '
                acronimedName += files[f].replace(/[^\w\s\][^,]/gi, "")
                acronimedName = acronimedName.replace('mp3', '')
                acronimedName += '.mp3'

                let folder = files[f].replace(/[^\w\s\][^,]/gi, "")
                folder = folder.replace('mp3', '')

                let newFilePath = path.join(dir, acronimedName)
                try {
                    fs.renameSync(filePath, newFilePath)
                    console.log('Rename:', newFilePath)
                    mkdir(path.join(dir, folder))
                    mv(
                        newFilePath,
                        path.join(dir, folder, acronimedName),
                        e => {
                            if (e) {
                                console.error('Moved: Error happened while moving after renaming\n', e)
                            } else console.log("Moved:", files[f]);
                        }
                    )
                } catch (e) {
                    console.error('Rename: DID NOT WORK =>', newFilePath, '\nError is:\n', e)
                }

            } else console.log(`Rename: Folder or Already renamed => ${files[f]}`)

        }

    } catch (e) {
        console.log('Error happened while trying to read files for renaming', e)
    }
}

function cli() {
        
    prompt.start()
    let questions = [
        `Enter directory path (Everything inside will be foldrized)`
    ]

    prompt.get([questions[0]], function(err, result) {
        
        if (err) {
            return onErr(err)
        }
        let dir = result[ questions[0] ]
        if ( dir !== '' ){

            console.log( 'Dir is:\n', dir)
            
            let files = fs.readdirSync(dir)
            
            console.log( 'Files listed are:\n\n', JSON.stringify(files, null, 4) )

            run({ dir })


        } else console.log('Wrong input. Exiting . . . ')
    
    })

    
}

function onErr(err) {
    console.log(err)
    return 1
}

function run(params) {
    
    let q = `Is this is the correct directory otherwise [Y/N]`

    prompt.get([q], (e, r) => {

        if ( r[q] === 'Y' || r[q] === 'y' ) {

            let folder = params.dir.split('\\')[ params.dir.split('\\').length - 1 ]
            moveEachFileInOwnFolder( params.dir, { name: folder } )
        
        } else console.log('Exiting .... Wrong directory')

    })

}