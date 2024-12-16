import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const seedersDir = path.join(__dirname, '../src/seeders')

const getSeederFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter(
      (file) => file.endsWith('.seeder.ts') || file.endsWith('.seeder.js')
    )
}

const runSeeders = async () => {
  const seeders = getSeederFiles(seedersDir)

  if (seeders.length === 0) {
    console.log('No se encontraron seeders en la carpeta:', seedersDir)
    process.exit(0)
  }

  console.log(`Encontrados ${seeders.length} seeders. Ejecutando...\n`)

  for (const seeder of seeders) {
    const seederPath = path.join(seedersDir, seeder)
    console.log(`Ejecutando seeder: ${seeder}`)
    try {
      await new Promise((resolve, reject) => {
        const command = `npx ts-node ${seederPath}`
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error ejecutando ${seeder}:\n`, stderr)
            reject(error)
          } else {
            console.log(`Salida de ${seeder}:\n`, stdout)
            resolve()
          }
        })
      })
    } catch (err) {
      console.error(`Seeder fallido: ${seeder}`, err)
      process.exit(1)
    }
  }

  console.log('\nTodos los seeders se ejecutaron correctamente.')
}

runSeeders()
