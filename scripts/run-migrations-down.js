import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const migrationsDir = path.join(__dirname, '../src/migrations')

const getMigrationFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))
    .sort((a, b) => (a > b ? -1 : 1))
}

const runMigrationDown = async (migrationName) => {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando migración DOWN: ${migrationName}`)
    exec(`npx migrate-mongo down`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar DOWN: ${migrationName}`)
        reject(error)
      } else {
        console.log(stdout)
        resolve()
      }
    })
  })
}

const runAllMigrationsDown = async () => {
  const migrationFiles = getMigrationFiles(migrationsDir)

  if (migrationFiles.length === 0) {
    console.log('No se encontraron migraciones en la carpeta.')
    process.exit(0)
  }

  console.log(
    `Encontradas ${migrationFiles.length} migraciones. Ejecutando DOWN...\n`
  )

  for (const migration of migrationFiles) {
    try {
      await runMigrationDown(migration)
    } catch (error) {
      console.error(`Fallo al hacer DOWN en la migración: ${migration}`)
      process.exit(1)
    }
  }

  console.log('\nTodas las migraciones se han revertido correctamente.')
}

runAllMigrationsDown()
